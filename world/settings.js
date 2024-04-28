const Settings = {
  useCarImage: false,
  numCars: 100, // Only low N if using img!
  mutationFactor: 0.05,
  controlType: 'AI', // one of AI, KEYS, DUMMY
  worldGenerateTreesTryCount: 100, // 10 for quick
  enableDebugMode: false, // if true disable damage and sound
  useFullScreen3D: true
};

function elById(id) {
  return document.getElementById(id);
}