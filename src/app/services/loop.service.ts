import { inject, Injectable } from "@angular/core";
import * as Tone from 'tone';
import { SeqService } from "./seq.service";
import { InstrumentsBuilderService } from "./instruments-builder.service";
import { ValueConverterService } from "./value-converter.service";
import { ConfigService } from "./config.service";


@Injectable({ providedIn: 'root' })
export class LoopService {
    public seqService = inject(SeqService);
    public instrumentsBuilderService = inject(InstrumentsBuilderService);
    public valueConverterService = inject(ValueConverterService);

    public configService = inject(ConfigService);
    source: any = this.configService.getConfig();

    loopBeat: any;
    isConsented = false;

    public iterrators: any;
    public sampleIterrators: any;  

    instruments: any;

    setSource(src: any) {
        this.source = src;
    }

    getSource() {
        return this.source;
    }

    play() {
        this.loopBeat.start(0);
        //debugger;
    }

    consent() {
        this.initToneObjects();
    }

    reInitIterrators() {
        this.iterrators = Object.keys(this.iterrators).reduce((sum, key) => {
            return {
                ...sum,
                [key]: {
                    j: 0,
                    i: 0,
                },
            };
        }, {}) as any;

        this.sampleIterrators = Object.keys(this.sampleIterrators).reduce((sum, key)=>{
          return {
            ...sum,
            [key]: {
              j: 0,
              i: 0,
            },
          };
        }, {}) as any;
    }

    initToneObjects() {
        this.instruments = this.instrumentsBuilderService.getInstruments();
        let i = 0;

        const synthNames = Object.keys(this.source.synths);
        const sampleNames = Object.keys(this.source.samples);

        this.iterrators = synthNames.reduce((sum, key) => {
            return {
                ...sum,
                [key]: {
                    // iterration inside "['a', 'b', 'c']"
                    j: 0,
                    // iterration inside "+[255, 120, 420]"
                    i: 0,
                },
            };
        }, {}) as any;

        this.sampleIterrators = sampleNames.reduce((sum, key)=>{
          return {
            ...sum,
            [key]: {
              // iterration inside "['a', 'b', 'c']"
              j: 0,
              // iterration inside "+[255, 120, 420]"
              i: 0,
            },
          };
        }, {}) as any;

        this.loopBeat = new Tone.Loop((time) => {
            synthNames.forEach((name) => {
                const config = this.source.synths;
                const setting = config[name];

                const type = setting.type;
                const variants = setting.variants;
                const settingSeqs = setting?.seqs?.val;
                const currentSeqVol = setting?.seqs.volume; 
                
                
                // the problem is here, in this version 
                if (!settingSeqs || settingSeqs?.length === 0) {
                    return;
                }

                const currentSeq = setting.seqs.val[this.iterrators[name].j];

                if (i === 15 && settingSeqs.length > 1) {
                    this.iterrators[name].j = (this.iterrators[name].j + 1) % settingSeqs.length;
                }

                const currentVariant = variants[currentSeq];
                //debugger;
                const encodedgridLine = setting.config.rythms[currentVariant.rythm]//.val;

                if (!encodedgridLine) {
                    debugger;
                }
                const decodedgridLine = this.seqService.decodeGridLine(encodedgridLine);
                const currentGridSymbol = decodedgridLine[i];

                if (currentGridSymbol !== '-') {
                    const synth = this.instruments.synths[name];
                    const currentSynthConfig = setting.config;

                    // set effects:
                    synth.effects.feedbackDelay.set(currentSynthConfig.effects[currentVariant.effect]?.feedbackDelay);
                    synth.effects.reverb.decay = currentSynthConfig.effects[currentVariant.effect]?.reverb?.decay || 1;

                    const distortion = this.valueConverterService.frStrToNumber(
                        currentSynthConfig.effects[currentVariant.effect]?.distortion?.distortion || 0,
                        this.iterrators[name].i
                    );
                    synth.effects.distortion.distortion = distortion;


                    const configPartials = currentSynthConfig.sounds[currentVariant.sound][currentGridSymbol]?.oscillator?.partials;

                    if (synth?.instrument?.oscillator) {
                        if (configPartials) {
                            if (configPartials?.length < 1) {
                                synth.instrument.oscillator.type = 'sine';
                            } else {
                                synth.instrument.oscillator.type = 'fatcustom';
                            }
                            synth.instrument.oscillator.partials = configPartials;
                        } else {
                            synth.instrument.oscillator.type = currentSynthConfig.sounds[currentVariant.sound][currentGridSymbol]?.oscillator?.type;
                        }
                    }

                    if (synth?.instrument?.oscillator?.spread) {
                        const spread = synth?.instrument?.oscillator?.spread;
                        synth.instrument.oscillator.spread = spread;
                    }

                    if (synth?.instrument?.oscillator?.count) {
                        const count = synth?.instrument?.oscillator?.count;
                        synth.instrument.oscillator.spread = count;
                    }


                    const currentConfigFr = currentSynthConfig.sounds[currentVariant.sound][currentGridSymbol].fr;

                    const fr = this.valueConverterService.frStrToNumber(
                        currentConfigFr,
                        this.iterrators[name].i
                    );
                    const duration = currentSynthConfig.sounds[currentVariant.sound][currentGridSymbol].duration;

                    synth.instrument.volume.value = currentSeqVol ?? (currentSynthConfig?.volume || 0);

                    const envelope = currentSynthConfig.sounds[currentVariant.sound][currentGridSymbol].envelope;

                    if (envelope) {
                        if (type === 'monoSynth') {
                            const detune = currentSynthConfig.sounds[currentVariant.sound][currentGridSymbol].detune;
                            const filter = currentSynthConfig.sounds[currentVariant.sound][currentGridSymbol].filter;
                            const filterEnvelope = currentSynthConfig.sounds[currentVariant.sound][currentGridSymbol].filterEnvelope;

                            (synth.instrument as Tone.Synth)?.set({
                                ...envelope,
                                detune,
                                filter,
                                filterEnvelope
                            });
                        } else {
                            (synth.instrument as Tone.Synth)?.set({ envelope });
                        }
                    }
                    synth.instrument.triggerAttackRelease(fr, duration, time);

                    this.iterrators[name].i = (this.iterrators[name].i + 1) % (JSON.parse(currentConfigFr.replace('+', '')).length);
                }
            });

            sampleNames.forEach((name) => {
                const config = this.source.samples;
                const setting = config[name];

                const variants = setting.variants;
                const settingSeqs = setting?.seqs?.val;
                const currentSeqVol = setting?.seqs?.volume;

                // the problem is here, in this version 
                if (!settingSeqs || settingSeqs?.length === 0) {
                    return;
                }

                const currentSeq = setting.seqs.val[this.sampleIterrators[name].j];

                if (i === 15 && settingSeqs.length > 1) {
                    this.sampleIterrators[name].j = (this.sampleIterrators[name].j + 1) % settingSeqs.length;
                }

                const currentVariant = variants[currentSeq];
                
                const encodedgridLine = setting.config.rythms[currentVariant.rythm]//.val;
                //debugger;
                if (!encodedgridLine) {
                    debugger;
                }
                const decodedgridLine = this.seqService.decodeGridLine(encodedgridLine);
                const currentGridSymbol = decodedgridLine[i];

                if (currentGridSymbol !== '-') {
                    const sampleInstrument = this.instruments.players[name];

                    const currentSynthConfig = setting.config;

                    // set effects:
                    // synth.effects.feedbackDelay.set(currentSynthConfig.effects[currentVariant.effect]?.feedbackDelay);
                    sampleInstrument.effects.reverb.decay = currentSynthConfig.effects[currentVariant.effect]?.reverb?.decay || 1;

                    // const distortion = this.valueConverterService.frStrToNumber(
                    //     currentSynthConfig.effects[currentVariant.effect]?.distortion?.distortion || 0,
                    //     this.iterrators[name].i
                    // );
                    // synth.effects.distortion.distortion = distortion;

                    const currentConfigSkipStr = currentSynthConfig.sounds[currentVariant.sound][currentGridSymbol].skip;

                    const skip = this.valueConverterService.frStrToNumber(
                        currentConfigSkipStr,
                        this.sampleIterrators[name].i
                    );

                    const currentConfigDurationStr = currentSynthConfig.sounds[currentVariant.sound][currentGridSymbol].duration;

                    const duration = this.valueConverterService.frStrToNumber(
                        currentConfigDurationStr,
                        this.sampleIterrators[name].i
                    );

                    //const duration = currentSynthConfig.sounds[currentVariant.sound][currentGridSymbol].duration;

                    sampleInstrument.instrument.volume.value = currentSeqVol ?? (currentSynthConfig?.volume || 0);

                    sampleInstrument.instrument.start(0, skip, duration);

                    this.sampleIterrators[name].i = (this.sampleIterrators[name].i + 1) % (JSON.parse(currentConfigSkipStr.replace('+', '')).length);
                }
            });

            i = (i + 1) % 16;    // 0..15
        }, this.source.interval || '32n'); //4n = 120 bpm <-> '16n'
        //PLACE THIS SHIT OUT ASAP

        // check out what to do it this deprecated case
        Tone.Transport.start();
    }

}