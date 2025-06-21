//this sample mode is very heavy, use for composing, not for performing

enum DrumSamplesFolderNames {
    //'4OP-FM' = '4OP-FM', //!
    bongos = 'Bongos',
    cR78  = 'CR78',
    kPR77 = 'KPR77',    //!
    kit3  = 'Kit3',
    kit8  = 'Kit8',      //!
    lINN  = 'LINN',
    r8  = 'R8',
    stark = 'Stark',    //!
    techno  = 'Techno', //!
  };
  
  const drumKeys = Object.keys(DrumSamplesFolderNames);

  const drumSamples = drumKeys.reduce((outerSum, drumKey) => {
    const drumKeySet = ['tom', 'kick', 'hihat', 'snare'].reduce((sum, current) => {

      const capitalized =
      current.charAt(0).toUpperCase()
        + current.slice(1);

      return {...sum,
      [drumKey + capitalized]:
        `https://tonejs.github.io/audio/drum-samples/${(DrumSamplesFolderNames as any)[drumKey]}/${
          current === 'tom' ? current+'1' : current
        }.mp3`,
      }
    }, {});

    return {
      ...outerSum,
      ...drumKeySet,
    };
  }, {});
  
  export const ALL_DRUMS_MOCK_SAMPLE_URLS = {
    ...drumSamples,
    cookieTin: `https://tonejs.github.io/audio/berklee/CookieTin3.mp3`,
    aprNote: `https://tonejs.github.io/audio/berklee/Arp_note.mp3`,
    fM_dubhit2: `https://tonejs.github.io/audio/berklee/FM_dubhit2.mp3`,
    diffusor3: `https://tonejs.github.io/audio/impulse-responses/diffusor3.mp3`,
    wildecho: `https://tonejs.github.io/audio/impulse-responses/wildecho.mp3`,
    bowed_cymbal_1b: `https://tonejs.github.io/audio/berklee/bowed_cymbal_1b.mp3`,
    crowd3: `https://tonejs.github.io/audio/berklee/crowd3.mp3`,
    blackboardHit1: `https://tonejs.github.io/audio/berklee/BlackboardHit1.mp3`,
    fuzz_bass_1: `https://tonejs.github.io/audio/berklee/fuzz_bass_1.mp3`,
    femalevoice_oo: `https://tonejs.github.io/audio/berklee/femalevoice_oo_femalevoice_oo_A3.mp3`,
    femalevoices_aa: `https://tonejs.github.io/audio/berklee/femalevoices_aa2_A3.mp3`,
    paula: `pauli.wav`,
    sasha: `sasha.wav`,
  };
  