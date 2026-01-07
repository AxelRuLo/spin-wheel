import { useState, useRef } from 'react';
import { RotateCw, Trophy, AlertCircle, Loader } from 'lucide-react';

function SpinWheel({ prizes, selectedPerson, onSpinComplete, allPeople }) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState(null);
  const wheelRef = useRef(null);

  // Define base colors for segments (will be used cyclically)
  const baseColors = [
    '#FF6B6B', // Red
    '#4ECDC4', // Teal
    '#45B7D1', // Blue
    '#FFA07A', // Light Salmon
    '#98D8C8', // Mint
    '#F7DC6F', // Yellow
    '#BB8FCE', // Purple
    '#85C1E2', // Sky Blue
  ];

  // Build the display list: all people except the selected person and those who already have a partner
  const displayPrizes = selectedPerson 
    ? allPeople
        .filter(person => person.id !== selectedPerson.id && !person.tienePareja)
        .map(person => `👤 ${person.name}`)
    : [];

  // Helper to get a color for a segment index
  const getColor = (index) => {
    return baseColors[index % baseColors.length];
  };

  const handleSpin = () => {
    if (isSpinning || !selectedPerson || displayPrizes.length === 0) return;

    setIsSpinning(true);
    setResult(null);

  // Calculate random rotation (5-10 full rotations plus random angle)
  const minRotation = 1800; // 5 full rotations
  const maxRotation = 3600; // 10 full rotations
  const randomRotation = Math.floor(Math.random() * (maxRotation - minRotation + 1)) + minRotation;
  const randomAngle = Math.floor(Math.random() * 360);
  const totalRotation = rotation + randomRotation + randomAngle;

    setRotation(totalRotation);

    // Wait for animation to complete
    setTimeout(() => {
      // Calculate winning segment using the display prizes
      const segmentAngle = 360 / displayPrizes.length;
      const normalizedRotation = totalRotation % 360;
      let winningIndex = Math.floor((360 - normalizedRotation) / segmentAngle) % displayPrizes.length;
      let winningPrize = displayPrizes[winningIndex];

      console.log(`${selectedPerson.name} le dará regalos a: ${winningPrize}`);

      setResult(winningPrize);
      setIsSpinning(false);
      onSpinComplete(winningPrize);
    }, 4000); // Match animation duration
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <RotateCw className="w-6 h-6 text-purple-600" />
        <h2 className="text-2xl font-bold text-gray-800">Gira la Ruleta</h2>
      </div>

      {!selectedPerson && (
        <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
          <p className="text-yellow-800 text-sm">
            Por favor selecciona quien eres antes de girar la ruleta
          </p>
        </div>
      )}

      {selectedPerson && displayPrizes.length === 0 && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-red-800 text-sm">
            No hay personas disponibles sin pareja asignada
          </p>
        </div>
      )}

      {/* Wheel Container */}
      <div className="flex flex-col items-center justify-center py-8">
        <div className="relative">
          {/* Pointer */}
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10">
            <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[30px] border-t-red-500 drop-shadow-lg"></div>
          </div>

          {/* Wheel */}
          <div
            ref={wheelRef}
            className={`relative w-80 h-80 rounded-full shadow-2xl ${
              !selectedPerson ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: isSpinning ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
            }}
          >
            {/* Wheel Segments (uses displayPrizes which may include the selected person) */}
            {displayPrizes.map((prize, index) => {
              const segmentAngle = 360 / displayPrizes.length;
              const startAngle = index * segmentAngle;
              
              return (
                <div
                  key={index}
                  className="absolute w-full h-full"
                  style={{
                    transform: `rotate(${startAngle}deg)`,
                    clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.sin((segmentAngle * Math.PI) / 180)}% ${50 - 50 * Math.cos((segmentAngle * Math.PI) / 180)}%)`,
                  }}
                >
                  <div
                    className="w-full h-full flex items-start justify-center pt-8"
                    style={{
                      backgroundColor: getColor(index),
                    }}
                  >
                    <span
                      className="text-white font-bold text-sm"
                      style={{
                        transform: `rotate(${segmentAngle / 2}deg)`,
                        maxWidth: '70px',
                        textAlign: 'center',
                      }}
                    >
                      {prize}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Center Circle */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full shadow-lg border-4 border-purple-600 flex items-center justify-center">
              <RotateCw className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Spin Button */}
        <button
          onClick={handleSpin}
          disabled={isSpinning || !selectedPerson || displayPrizes.length === 0}
          className={`
            mt-8 px-8 py-3 rounded-lg font-bold text-lg transition-all
            ${
              isSpinning || !selectedPerson || displayPrizes.length === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-purple-600 text-white hover:bg-purple-700 active:scale-95 shadow-lg hover:shadow-xl'
            }
          `}
        >
          {isSpinning ? (
            <span className="flex items-center gap-2">
              <Loader className="w-5 h-5 animate-spin" />
              Girando...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <RotateCw className="w-5 h-5" />
              ¡Girar la Ruleta!
            </span>
          )}
        </button>

        {/* Result Display */}
        {result && !isSpinning && (
          <div className="mt-6 p-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg shadow-xl animate-bounce">
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-white" />
              <div>
                <p className="text-white font-bold text-xl">¡{selectedPerson.name} le dará regalos a!</p>
                <p className="text-white text-lg">{result}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SpinWheel;
