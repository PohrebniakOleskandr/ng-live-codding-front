import { Injectable } from "@angular/core";
import { GENTLEMAN_MOCK_SAMPLE_URLS } from "../mocks/gentleman-samples.mock";
import { ALL_DRUMS_MOCK_SAMPLE_URLS } from "../mocks/all_drums_gentleman-samples.mock";
import { DNB_MOCK_SAMPLE_URLS } from "../mocks/dnb-samples.mock";
import { INDIVIDUAL_ONE_MOCK_SAMPLE_URLS } from "../mocks/individualOne.mock";

enum SampleSets {
    Ligth = 'light',
    Heaavy = 'heavy',
    DrumNBass = 'dnb',
}


@Injectable({ providedIn: 'root' })
export class SampleService {
    currentSet = SampleSets.Heaavy;
    
    getSampleUrls() {
        // if(this.currentSet === SampleSets.Ligth) {
        //     return GENTLEMAN_MOCK_SAMPLE_URLS;
        // } else if(this.currentSet === SampleSets.Heaavy)  {
        //     return ALL_DRUMS_MOCK_SAMPLE_URLS;
        // } else {
        //     return DNB_MOCK_SAMPLE_URLS;
        // }

        return INDIVIDUAL_ONE_MOCK_SAMPLE_URLS;
    }
}