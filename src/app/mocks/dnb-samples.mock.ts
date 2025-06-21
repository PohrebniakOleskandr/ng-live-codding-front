enum DrumSamplesFolderNames {
    //'4OP-FM' = '4OP-FM', //!
    Bongos = 'Bongos',
    CR78  = 'CR78',
    KPR77 = 'KPR77',    //!
    Kit3  = 'Kit3',
    Kit8  = 'Kit8',      //!
    LINN  = 'LINN',
    R8  = 'R8',
    Stark = 'Stark',    //!
    Techno  = 'Techno', //!
  }
  
  //Techno - is standart
  const TECHNO_INSTRUMENTS_FOLDER_NAME = DrumSamplesFolderNames.Techno;
  
  export const DNB_MOCK_SAMPLE_URLS = {
    tom: `https://tonejs.github.io/audio/drum-samples/${TECHNO_INSTRUMENTS_FOLDER_NAME}/tom1.mp3`,
    kick: `https://tonejs.github.io/audio/drum-samples/${TECHNO_INSTRUMENTS_FOLDER_NAME}/kick.mp3`,
    hihat: `https://tonejs.github.io/audio/drum-samples/${TECHNO_INSTRUMENTS_FOLDER_NAME}/hihat.mp3`,
    snare: `https://tonejs.github.io/audio/drum-samples/${TECHNO_INSTRUMENTS_FOLDER_NAME}/snare.mp3`,
    handdrumLoop: `https://tonejs.github.io/audio/drum-samples/handdrum-loop.mp3`,
    //non techno samples:
  };
  