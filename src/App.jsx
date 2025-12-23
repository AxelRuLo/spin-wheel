import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import PersonSelector from './components/PersonSelector';
import SpinWheel from './components/SpinWheel';

function App() {
  const [people, setPeople] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [loading, setLoading] = useState(true);

  // Define default prizes
  const prizes = [
    '🎁 Prize 1',
    '🎊 Prize 2',
    '🎉 Prize 3',
    '🏆 Prize 4',
    '⭐ Prize 5',
    '💎 Prize 6',
    '🎯 Prize 7',
    '🌟 Prize 8',
  ];

  // Fetch people from Firestore on component mount
  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'people'));
        const peopleData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPeople(peopleData);
      } catch (error) {
        console.error('Error fetching people:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPeople();
  }, []);

  // Handle spin result and save to Firestore
  const handleSpinComplete = async (result) => {
    if (selectedPerson) {
      try {
        await addDoc(collection(db, 'spinHistory'), {
          personId: selectedPerson.id,
          personName: selectedPerson.name,
          result: result,
          timestamp: serverTimestamp(),
        });
        console.log('Spin result saved to history');
      } catch (error) {
        console.error('Error saving spin result:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-8 drop-shadow-lg">
          🎡 Spin Wheel
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Person Selector Card */}
          <div className="bg-white rounded-lg shadow-xl p-6">
            <PersonSelector
              people={people}
              selectedPerson={selectedPerson}
              onSelectPerson={setSelectedPerson}
              loading={loading}
            />
          </div>

          {/* Spin Wheel Card */}
          <div className="bg-white rounded-lg shadow-xl p-6">
            <SpinWheel
              prizes={prizes}
              selectedPerson={selectedPerson}
              onSpinComplete={handleSpinComplete}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
