import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import PersonSelector from './components/PersonSelector';
import SpinWheel from './components/SpinWheel';

// Import images
import axelImg from './img/axel.jpeg';
import karlaImg from './img/karla.jpeg';
import adyImg from './img/ady.jpeg';
import andreaImg from './img/andy.jpeg';
import mayiImg from './img/mayi.jpeg';
import kenImg from './img/ken.jpeg';
import tavoImg from './img/tavo.jpeg';
import fanyImg from './img/fany.jpeg';
import ambuImg from './img/ambu.jpeg';
import andyChildrenImg from './img/andyChildren.jpeg';
import elpatronImg from './img/elpatron.jpeg';
import hermanoFanyImg from './img/sandro.jpeg';
import lachinaImg from './img/lachina.jpeg';
import mariluImg from './img/marilu.jpeg';
import pameImg from './img/pame.jpeg';
import pinkyImg from './img/pinky.jpeg';
import rastaImg from './img/elvia.jpeg';
import xioImg from './img/xio.jpeg';
import yasminImg from './img/yasmin.jpeg';
import saraImg from './img/sara.jpeg';

function App() {
  const [people, setPeople] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [loading, setLoading] = useState(true);

  // Define default prizes
  const prizes = [
    '🎁 Premio 1',
    '🎊 Premio 2',
    '🎉 Premio 3',
    '🏆 Premio 4',
    '⭐ Premio 5',
    '💎 Premio 6',
    '🎯 Premio 7',
    '🌟 Premio 8',
  ];

  // Demo data for testing
  const demoPeople = [
    { id: 'demo-1', name: 'Axel', img: axelImg },
    { id: 'demo-2', name: 'Karla', img: karlaImg },
    { id: 'demo-3', name: 'Ady', img: adyImg },
    { id: 'demo-4', name: 'Andrea', img: andreaImg },
    { id: 'demo-5', name: 'Mayi', img: mayiImg },
    { id: 'demo-6', name: 'Ken', img: kenImg },
    { id: 'demo-7', name: 'Tavo', img: tavoImg },
    { id: 'demo-8', name: 'Fany', img: fanyImg },
    { id: 'demo-9', name: 'Ambu', img: ambuImg },
    { id: 'demo-10', name: 'Andy Children', img: andyChildrenImg },
    { id: 'demo-11', name: 'El Patron', img: elpatronImg },
    { id: 'demo-12', name: 'Hermano Fany', img: hermanoFanyImg },
    { id: 'demo-13', name: 'La China', img: lachinaImg },
    { id: 'demo-14', name: 'Marilu', img: mariluImg },
    { id: 'demo-15', name: 'Pame', img: pameImg },
    { id: 'demo-16', name: 'Pinky', img: pinkyImg },
    { id: 'demo-17', name: 'Rasta', img: rastaImg },
    { id: 'demo-18', name: 'Xio', img: xioImg },
    { id: 'demo-19', name: 'Yasmin', img: yasminImg },
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
        
        // Create a map of names to images
        const imageMap = {
          'axel': axelImg,
          'sara': saraImg,
          'karla': karlaImg,
          'ady': adyImg,
          'andrea': andreaImg,
          'mayi': mayiImg,
          'ken': kenImg,
          'tavo': tavoImg,
          'fany': fanyImg,
          'ambu': ambuImg,
          'andy': andyChildrenImg,
          'andychildren': andyChildrenImg,
          'el patron': elpatronImg,
          'elpatron': elpatronImg,
          'hermano fany': hermanoFanyImg,
          'hermanofany': hermanoFanyImg,
          'sandro': hermanoFanyImg,
          'la china': lachinaImg,
          'lachina': lachinaImg,
          'marilu': mariluImg,
          'pame': pameImg,
          'pinky': pinkyImg,
          'rasta': rastaImg,
          'elvia': rastaImg,
          'xio': xioImg,
          'yasmin': yasminImg,
        };
        
        // Use Firebase data if available, otherwise use demo data
        if (peopleData.length > 0) {
          // Assign images based on name match
          const peopleWithImages = peopleData.map(person => {
            const nameLower = person.name.toLowerCase().trim();
            const img = imageMap[nameLower] || null;
            return {
              ...person,
              img
            };
          });
          console.log('Fetched people with images:', peopleWithImages);
          setPeople(peopleWithImages);
        } else {
          console.log('No se encontraron datos en Firebase, usando datos de demostración');
          setPeople(demoPeople);
        }
      } catch (error) {
        console.error('Error al obtener personas, usando datos de demostración:', error);
        setPeople(demoPeople);
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
        // Extract the person name from the result (format: "👤 Name")
        const recipientName = result.replace('👤 ', '');
        const recipient = people.find(p => p.name === recipientName);
        
        if (recipient) {
          // Mark ONLY the recipient (who came out in the wheel) as having a partner
          const db = (await import('./firebase')).db;
          const { doc, updateDoc } = await import('firebase/firestore');
          
          // Update ONLY the recipient
          await updateDoc(doc(db, 'people', recipient.id), {
            tienePareja: true,
            parejaAsignada: selectedPerson.name,
            parejaId: selectedPerson.id
          });
          
          console.log(`${selectedPerson.name} le dará regalos a ${recipient.name}`);
        }
        
        // Save to history
        await addDoc(collection(db, 'spinHistory'), {
          personId: selectedPerson.id,
          personName: selectedPerson.name,
          result: result,
          recipientName: recipientName,
          recipientId: recipient?.id,
          timestamp: serverTimestamp(),
        });
        
        console.log('Resultado del giro guardado en el historial');
        
        // Refresh the people list to update the UI
        // const querySnapshot = await getDocs(collection(db, 'people'));
        // const updatedPeopleData = querySnapshot.docs.map(doc => ({
        //   id: doc.id,
        //   ...doc.data()
        // }));
        
        // Assign images
        // const imageMap = {
        //   'axel': axelImg,
        //   'karla': karlaImg,
        //   'ady': adyImg,
        //   'andrea': andreaImg,
        //   'mayi': mayiImg,
        //   'ken': kenImg,
        //   'tavo': tavoImg,
        //   'fany': fanyImg,
        //   'ambu': ambuImg,
        //   'andy children': andyChildrenImg,
        //   'andychildren': andyChildrenImg,
        //   'el patron': elpatronImg,
        //   'elpatron': elpatronImg,
        //   'hermano fany': hermanoFanyImg,
        //   'hermanofany': hermanoFanyImg,
        //   'sandro': hermanoFanyImg,
        //   'la china': lachinaImg,
        //   'lachina': lachinaImg,
        //   'marilu': mariluImg,
        //   'pame': pameImg,
        //   'pinky': pinkyImg,
        //   'rasta': rastaImg,
        //   'elvia': rastaImg,
        //   'xio': xioImg,
        //   'yasmin': yasminImg,
        // };
        
        // const peopleWithImages = updatedPeopleData.map(person => {
        //   const nameLower = person.name.toLowerCase().trim();
        //   const img = imageMap[nameLower] || null;
        //   return {
        //     ...person,
        //     img
        //   };
        // });
        
        // // Update people first, then clear selection
        // setPeople(peopleWithImages);
        // // Use setTimeout to ensure the state update completes before clearing
        // setTimeout(() => {
        //   setSelectedPerson(null);
        // }, 0);
        
      } catch (error) {
        console.error('Error al guardar el resultado del giro:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-8 drop-shadow-lg">
          🎡 Ruleta de la Suerte
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
              allPeople={people}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
