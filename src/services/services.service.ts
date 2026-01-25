import { type ZenotiClient } from "@/_internal/client";
import { ListServicesResponse } from "./types";
import { calculateMatchScore } from "@/_shared/scoring.helper";

export class ServicesService {
    constructor(private readonly zenoti: ZenotiClient) {}
        
    async getAll(page: number = 1, size: number = 30) {
        const response = await this.zenoti.getClient().get(`/v1/Centers/${this.zenoti.getCenterId()}/services`, {
            params: {
                size,
                page
            }
        });

        const data = await response.data as ListServicesResponse;
        
        return data.services.map((service) => {
            return {
                id: service.id,
                name: service.name,
                code: service.code,
                price_info: service.price_info,
                duration: service.duration,
                description: service.description
            }
        })
    }

    /* Expirimental, may rate limit you  */
    async search(search_string: string){
        if (!search_string?.trim()) {
            return [];
        }

        const batchSize = 100;
        const batches = 10;

        const searchWords = search_string.toLowerCase()
        .split(/\s+/)
        .filter(word => word.length > 0);

        const servicePromises: ReturnType<typeof this.getAll>[] = [];
        for(let i = 1; i <= batches; i++) {
            servicePromises.push(this.getAll(i, batchSize));
        }

        const serviceExhaust = await Promise.all(servicePromises);

        const filteredArray = serviceExhaust.flatMap(obj => 
            Object.values(obj).filter(service => {
                if (!service?.name) return false;

                const serviceName = service.name.toLowerCase();

                return searchWords.every(word => serviceName.includes(word));
            })
        );

        return filteredArray.sort((a, b) => {
            const aName = a.name.toLowerCase();
            const bName = b.name.toLowerCase();

            const aScore = calculateMatchScore(aName, searchWords);
            const bScore = calculateMatchScore(bName, searchWords);

            return bScore - aScore;  
        });
    }
}
