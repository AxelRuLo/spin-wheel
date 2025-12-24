import { Users, UserCheck, Loader } from 'lucide-react';

function PersonSelector({ people, selectedPerson, onSelectPerson, loading }) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader className="w-12 h-12 text-purple-600 animate-spin mb-4" />
        <p className="text-gray-600">Cargando personas...</p>
      </div>
    );
  }

  if (people.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Users className="w-16 h-16 text-gray-300 mb-4" />
        <p className="text-gray-600 text-center">
          No se encontraron personas. Agrega personas a la colección 'people' en Firestore.
        </p>
      </div>
    );
  }

  const availablePeople = people.filter(person => !person.yaGiro);

  if (availablePeople.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Users className="w-16 h-16 text-green-400 mb-4" />
        <p className="text-green-600 text-center font-semibold">
          ¡Todas las personas ya han girado la ruleta! 🎉
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-6 h-6 text-purple-600" />
        <h2 className="text-2xl font-bold text-gray-800">Selecciona quien eres</h2>
      </div>
      
      <p className="text-gray-600 mb-4 text-sm">
        Eligete para girar la ruleta
        <br />
        Despues ve hasta abajo para girarla
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {availablePeople.map((person) => (
          <button
            key={person.id}
            onClick={() => onSelectPerson(person)}
            className={`
              flex items-center gap-3 p-4 rounded-lg border-2 transition-all
              ${
                selectedPerson?.id === person.id
                  ? 'border-purple-600 bg-purple-50 shadow-md'
                  : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
              }
            `}
          >
            {/* Avatar Image */}
            {person.img ? (
              <img 
                src={person.img} 
                alt={person.name}
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-300 flex-shrink-0"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                <span className="text-gray-500 font-bold text-2xl">
                  {person.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            
            {/* Selection Indicator */}
            {selectedPerson?.id === person.id && (
              <UserCheck className="w-5 h-5 text-purple-600 flex-shrink-0" />
            )}
            
            {/* Person Name */}
            <span className={`
              font-medium text-left flex-1
              ${
                selectedPerson?.id === person.id
                  ? 'text-purple-700'
                  : 'text-gray-700'
              }
            `}>
              {person.name}
            </span>
          </button>
        ))}
      </div>

      {selectedPerson && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 text-sm font-medium">
            ✓ Seleccionado: {selectedPerson.name}
          </p>
        </div>
      )}
    </div>
  );
}

export default PersonSelector;
