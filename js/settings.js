const Settings = {
    useCarImage: false,
    numCars: 100, // Only low N if using img!
    mutationFactor: 0.1,
    controlType: 'AI', // one of AI, KEYS, DUMMY
    worldFromFile: true, // From File? Otherwise, local storage.
};

let world = null;