import React, { useState } from 'react';

function App() {
  const origPlayers = [
    { firstName: 'Ben', lastName: '', isActive: true, inField: false, inGoal: false, subs: 0, goalieSubs: 0, consecutiveSubs: 0 },
    { firstName: 'Finn', lastName: '', isActive: true, inField: false, inGoal: false, subs: 0, goalieSubs: 0, consecutiveSubs: 0 },
    { firstName: 'Penny', lastName: '', isActive: true, inField: false, inGoal: false, subs: 0, goalieSubs: 0, consecutiveSubs: 0 },
    { firstName: 'Hugh', lastName: '', isActive: true, inField: false, inGoal: false, subs: 0, goalieSubs: 0, consecutiveSubs: 0 },
    { firstName: 'Emily', lastName: '', isActive: true, inField: false, inGoal: false, subs: 0, goalieSubs: 0, consecutiveSubs: 0 },
    { firstName: 'Sterling', lastName: '', isActive: true, inField: false, inGoal: false, subs: 0, goalieSubs: 0, consecutiveSubs: 0 },
    { firstName: 'Casey', lastName: '', isActive: true, inField: false, inGoal: false, subs: 0, goalieSubs: 0, consecutiveSubs: 0 },
    { firstName: 'Kinley', lastName: '', isActive: true, inField: false, inGoal: false, subs: 0, goalieSubs: 0, consecutiveSubs: 0 }
  ]

  const [players, setPlayers] = useState([...origPlayers]);
  const [playerCount, setPlayerCount] = useState(5);
  const [suggestModalVisible, setSuggestModalVisible] = useState(false);
  const [resetModalVisible, setResetModalVisible] = useState(false);
  const [suggestedLineup, setSuggestedLineup] = useState({ goalie: null, subs: [] });
  const [selectSubModalVisible, setSelectSubModalVisible] = useState(false);
  const [playerToDeactivate, setPlayerToDeactivate] = useState(null);

  const handleSuggestLineup = () => {
    const activePlayers = players.filter(p => p.isActive);
    if (activePlayers.length < playerCount) {
      setPlayerCount(activePlayers.length);
    }

    // 1. Determine the goalie as before
    var goalieSubs = Math.min(...activePlayers.map(p => p.goalieSubs));
    const eligibleGoalies = activePlayers
      .filter(p => p.goalieSubs === goalieSubs && !p.inGoal);

    // Now, among eligibleGoalies, pick those with the fewest consecutiveSubs
    const minGoalieConsec = Math.min(...eligibleGoalies.map(p => p.consecutiveSubs));
    const mostEligibleGoalies = eligibleGoalies.filter(p => p.consecutiveSubs === minGoalieConsec);

    // Randomly pick from the most eligible
    const goalie = mostEligibleGoalies[Math.floor(Math.random() * mostEligibleGoalies.length)];

    // 2. Add players currently on the bench (not inField, not inGoal, not the goalie)
    const benchPlayers = activePlayers.filter(
      p => !p.inField && !p.inGoal && p !== goalie
    );

    // 3. Fill remaining spots, favoring players with fewer consecutiveSubs, then fewer subs
    // Exclude goalie and already added bench players
    let candidates = activePlayers.filter(
      p => p !== goalie && !benchPlayers.includes(p)
    );

    // Sort by consecutiveSubs, then subs, then random for fairness
    candidates.sort((a, b) => {
      if (a.consecutiveSubs !== b.consecutiveSubs) {
        return a.consecutiveSubs - b.consecutiveSubs;
      }
      if (a.subs !== b.subs) {
        return a.subs - b.subs;
      }
      return Math.random() - 0.5;
    });

    // 4. Combine bench players and sorted candidates, then slice to required count
    const subs = [...benchPlayers, ...candidates].slice(0, playerCount - 1);

    setSuggestedLineup({ goalie, subs });
    setSuggestModalVisible(true);
  };

  const handleConfirmLineup = () => {
    const newPlayers = players.map(p => ({ ...p, inField: false, inGoal: false }));
    const goalieIndex = players.indexOf(suggestedLineup.goalie);
    if (goalieIndex >= 0) {
      newPlayers[goalieIndex].goalieSubs += 1;
      newPlayers[goalieIndex].consecutiveSubs += 1;
      newPlayers[goalieIndex].inGoal = true;
    }
    suggestedLineup.subs.forEach(sub => {
      const i = players.indexOf(sub);
      if (i >= 0) {
        newPlayers[i].subs += 1;
        newPlayers[i].inField = true;
        newPlayers[i].consecutiveSubs += 1;
      }
    });
    // Reset consecutive subs for all other players
    newPlayers.forEach((p, i) => {
      if (!p.inField && !p.inGoal) {
        newPlayers[i].consecutiveSubs = 0;
      }
    });
    setPlayers(newPlayers);
    setSuggestModalVisible(false);
  };

  return (
    <div style={{ paddingBottom: '80px', textAlign: 'center' }}>
      {/* In Field or In Goal */}
      <div style={{ border: '2px solid #4caf50', borderRadius: 8, margin: '16px auto 8px auto', maxWidth: 500, padding: 8 }}>
        <h3 style={{ margin: '4px 0' }}>On Field / In Goal</h3>
        {players.filter(p => p.isActive && (p.inField || p.inGoal)).length === 0 && (
          <div style={{ color: '#888', fontStyle: 'italic' }}>No players on field or in goal</div>
        )}
        {players.filter(p => p.isActive && (p.inField || p.inGoal)).map((player, index) => (
          <div key={player.firstName + player.lastName}
            style={{
              borderBottom: '1px solid #ccc',
              padding: '6px 10px',
              backgroundColor: player.inGoal ? 'lightblue' : '#e0ffe0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}>
            <h2 style={{ margin: '0 0 2px 0', fontSize: '1.3rem', display: 'inline' }}>
              {player.firstName} {player.lastName}
            </h2>
            <span style={{ fontSize: '0.95rem' }}>
              {player.inGoal ? 'Goalie' : 'Field'}
            </span>
            <span style={{ fontSize: '0.95rem', marginRight: 8 }}>
              [G: {player.goalieSubs} | F: {player.subs} | T: {player.goalieSubs + player.subs} | C: {player.consecutiveSubs}]
            </span>
            <label style={{ fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '2px' }}>
              <input
                type="checkbox"
                checked={player.isActive}
                onChange={e => {
                  const isChecked = !!e.target.checked;
                  if (!isChecked && (player.inField || player.inGoal)) {
                    setPlayerToDeactivate(player);
                    setSelectSubModalVisible(true);
                  } else {
                    const newPlayers = [...players];
                    const realIndex = players.findIndex(p => p.firstName === player.firstName && p.lastName === player.lastName);
                    newPlayers[realIndex].isActive = isChecked;
                    setPlayers(newPlayers);
                  }
                }}
              />
              Active
            </label>
          </div>
        ))}
      </div>

      {/* Active Bench */}
      <div style={{ border: '2px solid #2196f3', borderRadius: 8, margin: '8px auto', maxWidth: 500, padding: 8 }}>
        <h3 style={{ margin: '4px 0' }}>Bench (Active)</h3>
        {players.filter(p => p.isActive && !p.inField && !p.inGoal).length === 0 && (
          <div style={{ color: '#888', fontStyle: 'italic' }}>No active players on bench</div>
        )}
        {players.filter(p => p.isActive && !p.inField && !p.inGoal).map((player, index) => (
          <div key={player.firstName + player.lastName}
            style={{
              borderBottom: '1px solid #ccc',
              padding: '6px 10px',
              backgroundColor: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}>
            <h2 style={{ margin: '0 0 2px 0', fontSize: '1.3rem', display: 'inline' }}>
              {player.firstName} {player.lastName}
            </h2>
            <span style={{ fontSize: '0.95rem', marginRight: 8 }}>
              [G: {player.goalieSubs} | F: {player.subs} | T: {player.goalieSubs + player.subs} | C: {player.consecutiveSubs}]
            </span>
            <label style={{ fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '2px' }}>
              <input
                type="checkbox"
                checked={player.isActive}
                onChange={e => {
                  const isChecked = !!e.target.checked;
                  if (!isChecked && (player.inField || player.inGoal)) {
                    setPlayerToDeactivate(player);
                    setSelectSubModalVisible(true);
                  } else {
                    const newPlayers = [...players];
                    const realIndex = players.findIndex(p => p.firstName === player.firstName && p.lastName === player.lastName);
                    newPlayers[realIndex].isActive = isChecked;
                    setPlayers(newPlayers);
                  }
                }}
              />
              Active
            </label>
          </div>
        ))}
      </div>

      {/* Inactive */}
      <div style={{ border: '2px solid #aaa', borderRadius: 8, margin: '8px auto', maxWidth: 500, padding: 8 }}>
        <h3 style={{ margin: '4px 0' }}>Inactive Players</h3>
        {players.filter(p => !p.isActive).length === 0 && (
          <div style={{ color: '#888', fontStyle: 'italic' }}>No inactive players</div>
        )}
        {players.filter(p => !p.isActive).map((player, index) => (
          <div key={player.firstName + player.lastName}
            style={{
              borderBottom: '1px solid #ccc',
              padding: '6px 10px',
              backgroundColor: '#f8f8f8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}>
            <h2 style={{ margin: '0 0 2px 0', fontSize: '1.3rem', display: 'inline' }}>
              {player.firstName} {player.lastName}
            </h2>
            <span style={{ fontSize: '0.95rem', marginRight: 8 }}>
              [G: {player.goalieSubs} | F: {player.subs} | T: {player.goalieSubs + player.subs} | C: {player.consecutiveSubs}]
            </span>
            <label style={{ fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '2px' }}>
              <input
                type="checkbox"
                checked={player.isActive}
                onChange={e => {
                  const isChecked = !!e.target.checked;
                  if (!isChecked && (player.inField || player.inGoal)) {
                    setPlayerToDeactivate(player);
                    setSelectSubModalVisible(true);
                  } else {
                    const newPlayers = [...players];
                    const realIndex = players.findIndex(p => p.firstName === player.firstName && p.lastName === player.lastName);
                    newPlayers[realIndex].isActive = isChecked;
                    setPlayers(newPlayers);
                  }
                }}
              />
              Active
            </label>
          </div>
        ))}
      </div>

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

      {
        suggestModalVisible && (
          <div style={modalOverlayStyle}>
            <div style={modalContentStyle}>
              <h2>Suggested Lineup</h2>
              <h5 style={{ padding: '0px', margin: '0px' }}>Name [# Consec. Subs]</h5>
              <p>Goalie: {suggestedLineup.goalie?.firstName} {suggestedLineup.goalie?.lastName} [{suggestedLineup.goalie?.consecutiveSubs}]</p>
              {suggestedLineup.subs.map((sub, i) => (
                <p key={i}>{sub.firstName} {sub.lastName} [{sub.consecutiveSubs}]</p>
              ))}
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button onClick={() => setSuggestModalVisible(false)} style={redButtonStyle}>Decline</button>
                <button style={buttonStyle} onClick={handleConfirmLineup}>Confirm</button>
              </div>
            </div>
          </div>
        )
      }

      {
        resetModalVisible && (
          <div style={modalOverlayStyle}>
            <div style={modalContentStyle}>
              <h2>Confirm Reset</h2>
              <p>Are you sure you want to reset all lineups?</p>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button onClick={() => setResetModalVisible(false)} style={redButtonStyle}>Cancel</button>
                <button onClick={() => {
                  setPlayers([...origPlayers]);
                  setPlayerCount(5);
                  setResetModalVisible(false);
                }}
                  style={buttonStyle}>Confirm</button>
              </div>
            </div>
          </div>
        )
      }

      {
        selectSubModalVisible && playerToDeactivate && (
          <div style={modalOverlayStyle}>
            <div style={modalContentStyle}>
              <h2>Select Replacement</h2>
              <p>
                Deactivate <strong>{playerToDeactivate.firstName}</strong> and sub in:
              </p>
              <div style={{ maxHeight: 250, overflowY: 'auto', marginBottom: 16 }}>
                {players.filter(p => p.isActive && !p.inField && !p.inGoal).length === 0 && (
                  <div style={{ color: '#888', fontStyle: 'italic' }}>No active bench players available</div>
                )}
                {players.filter(p => p.isActive && !p.inField && !p.inGoal).map((bench, i) => (
                  <div key={bench.firstName + bench.lastName}
                    style={{
                      borderBottom: '1px solid #ccc',
                      padding: '6px 10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '8px'
                    }}>
                    <span>
                      {bench.firstName} {bench.lastName}
                      <span style={{ fontSize: '0.95rem', marginLeft: 8 }}>
                        [G: {bench.goalieSubs} | F: {bench.subs}]
                      </span>
                    </span>
                    <button
                      style={buttonStyle}
                      onClick={() => {
                        const newPlayers = [...players];
                        const deactivateIdx = players.findIndex(p => p === playerToDeactivate);
                        const replacementIdx = players.findIndex(p => p === bench);

                        if (replacementIdx >= 0) {
                          if (playerToDeactivate.inField) {
                            newPlayers[replacementIdx].inField = true;
                            newPlayers[replacementIdx].subs += 1;
                            newPlayers[replacementIdx].consecutiveSubs += 1;
                          }
                          else if (playerToDeactivate.inGoal) {
                            newPlayers[replacementIdx].inGoal = true;
                            newPlayers[replacementIdx].goalieSubs += 1;
                            newPlayers[replacementIdx].consecutiveSubs += 1;
                          }
                        }

                        if (deactivateIdx >= 0) {
                          newPlayers[deactivateIdx].isActive = false;
                          newPlayers[deactivateIdx].inField = false;
                          newPlayers[deactivateIdx].inGoal = false;
                          newPlayers[replacementIdx].consecutiveSubs = 0;
                        }

                        setPlayers(newPlayers);
                        setSelectSubModalVisible(false);
                        setPlayerToDeactivate(null);
                      }}
                    >Select</button>
                  </div>
                ))}
              </div>
              <button
                style={redButtonStyle}
                onClick={() => {
                  setSelectSubModalVisible(false);
                  setPlayerToDeactivate(null);
                }}
              >Cancel</button>
            </div>
          </div>
        )
      }
    </div >
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