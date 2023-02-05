// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

// Constants
import { citiesList } from '@/constants/cities.constants'

// Types
import { City } from '@/types/city.type';
import { ApiError } from '@/types/common.type';

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<City[] | ApiError>
) {
    const { query: { keyword = "" } = {} } = req;

    if (keyword.toString().toLocaleLowerCase() === 'fail')
        res.status(400).json({ error: 'Failed to get cities (backend response)', code: 400 });

    const filteredCities = citiesList.filter(city =>
        city.name.toLowerCase().includes(keyword?.toString().toLowerCase())
    );

    res.status(200).json(filteredCities);
}