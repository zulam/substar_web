import React, { useState } from 'react';

function App() {
  const [players, setPlayers] = useState([
    { firstName: 'Ben', lastName: '', subs: 0, goalieSubs: 0 },
    { firstName: 'Finn', lastName: '', subs: 0, goalieSubs: 0 },
    { firstName: 'Penny', lastName: '', subs: 0, goalieSubs: 0 },
    { firstName: 'Hugh', lastName: '', subs: 0, goalieSubs: 0 },
    { firstName: 'Emily', lastName: '', subs: 0, goalieSubs: 0 },
    { firstName: 'Sterling', lastName: '', subs: 0, goalieSubs: 0 },
    { firstName: 'Casey', lastName: '', subs: 0, goalieSubs: 0 },
    { firstName: 'Kinley', lastName: '', subs: 0, goalieSubs: 0 }
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [resetModalVisible, setResetModalVisible] = useState(false);
  const [suggestedLineup, setSuggestedLineup] = useState({ goalie: null, subs: [] });
  const [lastGoalieIndex, setLastGoalieIndex] = useState(-1);

  const handleSuggestLineup = () => {
    const nextGoalieIndex = (lastGoalieIndex + 1) % players.length;
    const goalie = players[nextGoalieIndex];
    const minSubs = Math.min(...players.map(p => p.subs));
    const eligiblePlayers = players.filter((p, i) => i !== nextGoalieIndex && p.subs === minSubs);
    const subs = eligiblePlayers.slice(0, 4);
    setSuggestedLineup({ goalie, subs });
    setModalVisible(true);
    setLastGoalieIndex(nextGoalieIndex);
  };

  const handleConfirmLineup = () => {
    const newPlayers = [...players];
    const goalieIndex = players.indexOf(suggestedLineup.goalie);
    if (goalieIndex >= 0) newPlayers[goalieIndex].goalieSubs += 1;
    suggestedLineup.subs.forEach(sub => {
      const i = players.indexOf(sub);
      if (i >= 0) newPlayers[i].subs += 1;
    });
    setPlayers(newPlayers);
    setModalVisible(false);
  };

  return (
    <div style={{ paddingBottom: '80px', textAlign: 'center' }}>
      <h1 style={{ textAlign: 'center' }}>Substitution Tracker</h1>
      {players.map((player, index) => (
        <div key={index} style={{ borderBottom: '1px solid #ccc', padding: '10px 20px' }}>
          <h2 style={{ margin: '0px' }}>{player.firstName} {player.lastName}</h2>
          <p>Subs: {player.subs}, Goalie Subs: {player.goalieSubs}</p>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            <button onClick={() => {
              const newPlayers = [...players];
              if (newPlayers[index].subs > 0) newPlayers[index].subs -= 1;
              setPlayers(newPlayers);
            }} style={redButtonStyle}>- Sub</button>
            <button
              onClick={() => {
                const newPlayers = [...players];
                newPlayers[index].subs += 1;
                setPlayers(newPlayers);
              }}
              style={buttonStyle}>
              + Sub
            </button>
            <button onClick={() => {
              const newPlayers = [...players];
              if (newPlayers[index].goalieSubs > 0) newPlayers[index].goalieSubs -= 1;
              setPlayers(newPlayers);
            }} style={redButtonStyle}>- Goalie</button>
            <button onClick={() => {
              const newPlayers = [...players];
              newPlayers[index].goalieSubs += 1;
              setPlayers(newPlayers);
            }}
              style={buttonStyle}>+ Goalie</button>
          </div>
        </div>
      ))}

      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'lightgray',
        borderTop: '1px solid #ccc',
        padding: '10px',
        display: 'flex',
        justifyContent: 'space-around'
      }}>
        {false && <>
          <button onClick={() => {
            setPlayers([...players, { firstName: 'New', lastName: 'Player', subs: 0, goalieSubs: 0 }]);
          }}>+ Player</button>
          <button onClick={() => {
            const newPlayers = [...players];
            newPlayers.pop();
            setPlayers(newPlayers);
          }} style={{ backgroundColor: 'red', color: 'white' }}>- Last Player</button>
        </>}
        <button onClick={handleSuggestLineup} style={greenButtonStyle}>Suggest</button>
        <button onClick={() => setResetModalVisible(true)} style={redButtonStyle}>Reset</button>
      </div>

      {modalVisible && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h2>Suggested Lineup</h2>
            <p>Goalie: {suggestedLineup.goalie?.firstName} {suggestedLineup.goalie?.lastName}</p>
            {suggestedLineup.subs.map((sub, i) => (
              <p key={i}>Sub: {sub.firstName} {sub.lastName}</p>
            ))}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button onClick={() => setModalVisible(false)} style={redButtonStyle}>Decline</button>
              <button style={buttonStyle} onClick={handleConfirmLineup}>Confirm</button>
            </div>
          </div>
        </div>
      )}

      {resetModalVisible && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h2>Confirm Reset</h2>
            <p>Are you sure you want to reset all lineups?</p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button onClick={() => setResetModalVisible(false)} style={redButtonStyle}>Cancel</button>
              <button onClick={() => {
                setPlayers(players.map(p => ({
                  ...p,
                  subs: 0,
                  goalieSubs: 0
                })));
                setResetModalVisible(false);
              }}
              style={buttonStyle}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const buttonStyle = { fontSize: '1rem', padding: '6px 4px' }
const redButtonStyle = { backgroundColor: 'red', color: 'white', fontSize: '1rem', padding: '6px 4px' }
const greenButtonStyle = { backgroundColor: 'green', color: 'white', fontSize: '1rem', padding: '6px 4px' }

const modalOverlayStyle = {
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000
};

const modalContentStyle = {
  backgroundColor: 'white',
  padding: '30px',
  borderRadius: '8px',
  minWidth: '300px',
  textAlign: 'center'
};

export default App;