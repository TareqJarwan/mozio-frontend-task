// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

// Utils
import { haversineDistance } from "@/utils/haversineDistance";

// Constants
import { citiesList } from "@/constants/cities.constants";

// Types
import { Distance } from "@/types/distance.type";
import { ApiError } from "@/types/common.type";

interface IResponse {
    results: Distance[];
    total: number;
}

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<IResponse | ApiError>
) {
    const { date, passengers, ...restQueries } = req.query;
    const { originCity, destinationCity, intermediateCities } = restQueries;
    const distances: Distance[] = [];
    let total = 0;

    const routes = [originCity];
    if (intermediateCities) routes.push(...intermediateCities?.toString().split(','));
    routes.push(destinationCity);

    if (!Object.keys(req.query).length) {
        res.status(400).json({ error: 'Missing Params', code: 400 });
    } else {
        distances.push({
            name: originCity?.toString(),
        });

        routes.forEach((route, i: number) => {
            const firstCity = citiesList.find((city) => city.name === routes[i]);
            const secondCity = citiesList.find((city) => city.name === routes[i + 1]);

            if (firstCity && secondCity) {
                const distance = haversineDistance(
                    { lat: firstCity.lat, lan: firstCity.lng },
                    { lat: secondCity.lat, lan: secondCity.lng },
                );
                distances.push({
                    distance: Math.trunc(distance),
                    name: secondCity.name,
                });
                total += Math.trunc(distance);
            }
        });

        res.status(200).send({ results: distances, total });
    }
}