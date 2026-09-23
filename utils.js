//Create length-26 array for each character in the key; all character counts initialised to 0
function createslfaArrays(keyLength) {
    const matrix = [];
    //console.log("KeyLength: " + keyLength);
    for (let i = 0; i < keyLength; i++) {
        const row = [];
        for (let j = 0; j < 26; j++) {
            row.push(0);
        }
        //console.log("ROW: " + row);
        matrix.push(row);
    }
    return matrix;
}

//keylength == slfaArrays.length
function parseCipherTextToKslfaArrays(cipherText, slfaArrays) {

    //TODO: REDUCE DPUILICATION OF keyLength var?
        //DEFINED IN PARENT TO BE PARAM FOR createslfaArrays(),
        //WHICH IS IN TURN A PARAMETER FOR THIS FUNCTION
    var keyLength = slfaArrays.length
    //Count ciphertext characters, by each character key 
    for (let i = 0; i < cipherText.length; i++) {

        //If cipherText[i] is in alphabet A-Z
        if ("A" <= cipherText[i] && cipherText[i] <= "Z") 
            //Increment the character count in the corresponding key
            console.log(cipherText.charCodeAt(i));
            slfaArrays[i % keyLength][cipherText.charCodeAt(i) - 65]++;
            console.log(`k-modulo: ${i % keyLength}, char: ${cipherText[i]} (${cipherText.charCodeAt(i)}), char count: ${slfaArrays[i % keyLength][0]}`);
    }
    console.log("slfaArrays: " + slfaArrays);

    //Return filled slfaArrays
    return slfaArrays
}



console.log("All utils have been read!")