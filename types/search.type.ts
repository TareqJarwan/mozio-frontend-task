import { City } from "@/types/city.type";

export interface FormData {
    originCity?: string;
    destinationCity?: string;
    intermediateCities?: string;
    date?: Date;
    passengers?: boolean;
    intermediate?: City[];
    origin?: City;
    destination?: City;
}