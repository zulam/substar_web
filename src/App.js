import React, { useState } from 'react';

function App() {
  const [players, setPlayers] = useState([
    { firstName: 'Ben', lastName: '', isActive: true, inField: false, inGoal: false, subs: 0, goalieSubs: 0 },
    { firstName: 'Finn', lastName: '', isActive: true, inField: false, inGoal: false, subs: 0, goalieSubs: 0 },
    { firstName: 'Penny', lastName: '', isActive: true, inField: false, inGoal: false, subs: 0, goalieSubs: 0 },
    { firstName: 'Hugh', lastName: '', isActive: true, inField: false, inGoal: false, subs: 0, goalieSubs: 0 },
    { firstName: 'Emily', lastName: '', isActive: true, inField: false, inGoal: false, subs: 0, goalieSubs: 0 },
    { firstName: 'Sterling', lastName: '', isActive: true, inField: false, inGoal: false, subs: 0, goalieSubs: 0 },
    { firstName: 'Casey', lastName: '', isActive: true, inField: false, inGoal: false, subs: 0, goalieSubs: 0 },
    { firstName: 'Kinley', lastName: '', isActive: true, inField: false, inGoal: false, subs: 0, goalieSubs: 0 }
  ]);

  const [playerCount, setPlayerCount] = useState(5);
  const [suggestModalVisible, setSuggestModalVisible] = useState(false);
  const [resetModalVisible, setResetModalVisible] = useState(false);
  const [suggestedLineup, setSuggestedLineup] = useState({ goalie: null, subs: [] });

  const handleSuggestLineup = () => {
    const activePlayers = players.filter(p => p.isActive);
    if (activePlayers.length < playerCount) {
      setPlayerCount(activePlayers.length);
    }

    var goalieSubs = Math.min(...activePlayers.map(p => p.goalieSubs));
    const eligibleGoalies = activePlayers.filter(p => p.goalieSubs === goalieSubs && !p.inGoal);
    const goalie = eligibleGoalies[Math.floor(Math.random() * eligibleGoalies.length)];

    var minSubs = Math.min(...activePlayers.map(p => p.subs));
    var shuffledPlayers = [...activePlayers].sort(() => Math.random() - 0.5);
    const eligiblePlayers = shuffledPlayers.filter(p => p !== goalie && p.subs === minSubs);
    while (eligiblePlayers.length < playerCount - 1) {
      ++minSubs;
      eligiblePlayers.push(...shuffledPlayers.filter(p => p !== goalie && p.subs === minSubs));
    }
    const subs = eligiblePlayers.slice(0, playerCount - 1);
    setSuggestedLineup({ goalie, subs });
    setSuggestModalVisible(true);
  };

  const handleConfirmLineup = () => {
    const newPlayers = players.map(p => ({ ...p, inField: false, inGoal: false }));
    const goalieIndex = players.indexOf(suggestedLineup.goalie);
    if (goalieIndex >= 0) {
      newPlayers[goalieIndex].goalieSubs += 1;
      newPlayers[goalieIndex].inGoal = true;
    }
    suggestedLineup.subs.forEach(sub => {
      const i = players.indexOf(sub);
      if (i >= 0) {
        newPlayers[i].subs += 1;
        newPlayers[i].inField = true;
      }
    });
    setPlayers(newPlayers);
    setSuggestModalVisible(false);
  };

  return (
    <div style={{ paddingBottom: '80px', textAlign: 'center' }}>
      {[...players].sort((a, b) => (a.isActive === b.isActive) ? 0 : a.isActive ? -1 : 1).map((player, index) => (
        <div key={index} style={{ borderBottom: '1px solid #ccc', padding: '6px 10px', backgroundColor: player.inField ? '#e0ffe0' : player.inGoal ? 'lightblue' : 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <h2 style={{ margin: '0 0 2px 0', fontSize: '1.3rem', display: 'inline' }}>
              {player.firstName} {player.lastName}
            </h2>
            <label style={{ fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '2px' }}>
              <input
                type="checkbox"
                checked={player.isActive}
                onChange={e => {
                  const newPlayers = [...players];
                  const realIndex = players.findIndex(p => p.firstName === player.firstName && p.lastName === player.lastName);
                  newPlayers[realIndex].isActive = !!e.target.checked;
                  setPlayers(newPlayers);
                }}
              />
              Active
            </label>
          </div>
          <p style={{ margin: '0 0 4px 0', fontSize: '0.95rem' }}>
            Subs: {player.subs} | Goalie Subs: {player.goalieSubs} | Total: {player.subs + player.goalieSubs}
          </p>
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
        <button onClick={() => setResetModalVisible(true)} style={redButtonStyle}>Reset</button>
        <button onClick={handleSuggestLineup} style={greenButtonStyle}>Suggest</button>
      </div>

      {suggestModalVisible && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h2>Suggested Lineup</h2>
            <p>Goalie: {suggestedLineup.goalie?.firstName} {suggestedLineup.goalie?.lastName} [{suggestedLineup.goalie?.subs + suggestedLineup.goalie?.goalieSubs}]</p>
            {suggestedLineup.subs.map((sub, i) => (
              <p key={i}>Sub: {sub.firstName} {sub.lastName} [{sub.subs + sub.goalieSubs}]</p>
            ))}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button onClick={() => setSuggestModalVisible(false)} style={redButtonStyle}>Decline</button>
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

const buttonStyle = { fontSize: '1rem', padding: '10px 5px' }
const redButtonStyle = { backgroundColor: 'red', color: 'white', fontSize: '1rem', padding: '10px 5px' }
const greenButtonStyle = { backgroundColor: 'green', color: 'white', fontSize: '1rem', padding: '10px 5px' }

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