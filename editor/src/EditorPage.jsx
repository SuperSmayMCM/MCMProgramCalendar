import React, { useState, useEffect } from 'react';
import CalendarPage from './CalendarPage';

import floorIcon1 from './assets/floorIcons/ElevatorButtonIcon-1.png'
import floorIcon2 from './assets/floorIcons/ElevatorButtonIcon-2.png'
import floorIconLL from './assets/floorIcons/ElevatorButtonIcon-LL.png'
import floorIconB from './assets/floorIcons/ElevatorButtonIcon-B.png'
import floorIconR from './assets/floorIcons/ElevatorButtonIcon-R.png'
import floorIconGreen from './assets/floorIcons/ElevatorButtonIcon-Green.png'
import floorIconOrange from './assets/floorIcons/ElevatorButtonIcon-Orange.png'

const AVAILABLE_ICONS = {
  '1': floorIcon1,
  '2': floorIcon2,
  'LL': floorIconLL,
  'B': floorIconB,
  'R': floorIconR,
  'Green': floorIconGreen,
  'Orange': floorIconOrange
};

export default function ProgramEditor() {
  // --- State Management ---
  // Default to today's date in YYYY-MM-DD format to match your backend
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [programs, setPrograms] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // --- Data Fetching ---
  useEffect(() => {
    const fetchDayData = async () => {
      setIsLoading(true);
      setStatusMessage('');

      try {
        const response = await fetch(`/data/day/${selectedDate}`);
        if (response.ok) {
          const result = await response.json();
          // Assuming your backend saves the array directly as 'data'
          setPrograms(result.data || []);
        } else if (response.status === 404) {
          // If no data exists for this day, start with a clean slate
          setPrograms([]);
        } else {
          setStatusMessage('Failed to load schedule.');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setStatusMessage('Network error while loading.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDayData();
  }, [selectedDate]); // Re-run whenever the selected date changes

  // --- Handlers ---
  const handleAddProgram = () => {
    // Grab the first key from your dictionary (e.g., '1') as the default
    const defaultIconKey = Object.keys(AVAILABLE_ICONS)[0];

    setPrograms([
      ...programs,
      { name: '', location: '', startTime: '', endTime: '', icon: defaultIconKey }
    ]);
  };

  const handleProgramChange = (index, field, value) => {
    const updatedPrograms = [...programs];
    updatedPrograms[index][field] = value;
    setPrograms(updatedPrograms);
  };

  const handleRemoveProgram = (indexToRemove) => {
    setPrograms(programs.filter((_, index) => index !== indexToRemove));
  };

  const handleSave = async () => {
    setStatusMessage('Saving...');
    try {
      const response = await fetch(`/data/day/${selectedDate}`, {
        method: 'PUT', // Your backend accepts POST or PUT
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(programs),
      });

      if (response.ok) {
        setStatusMessage('Saved successfully!');
        // Clear success message after 3 seconds
        setTimeout(() => setStatusMessage(''), 3000);
      } else {
        setStatusMessage('Error saving schedule.');
      }
    } catch (error) {
      console.error('Error saving data:', error);
      setStatusMessage('Network error while saving.');
    }
  };

  // --- Styles ---
  const styles = {
    container: { display: 'flex', height: '100vh', fontFamily: 'sans-serif' },
    editorPanel: { flex: 1, padding: '20px', borderRight: '1px solid #ccc', overflowY: 'auto' },
    previewPanel: { flex: 1, padding: '20px', backgroundColor: '#f9fafb', overflowY: 'auto' },
    topCenter: { textAlign: 'center', marginBottom: '30px' },
    dateInput: { padding: '10px', fontSize: '1.2rem', borderRadius: '5px', border: '1px solid #ccc' },
    programCard: { border: '1px solid #eee', padding: '15px', marginBottom: '15px', borderRadius: '8px', position: 'relative' },
    inputGroup: { display: 'flex', flexDirection: 'column', marginBottom: '10px' },
    disabled: { opacity: 0.5, pointerEvents: 'none' },
    input: { padding: '8px', marginTop: '4px', borderRadius: '4px', border: '1px solid #ccc' },
    row: { display: 'flex', gap: '10px' },
    button: { padding: '10px 15px', cursor: 'pointer', borderRadius: '5px', border: 'none', backgroundColor: '#007BFF', color: '#fff', fontWeight: 'bold' },
    removeBtn: { position: 'absolute', top: '10px', right: '10px', background: 'transparent', border: 'none', color: 'red', cursor: 'pointer' },
    status: { marginTop: '15px', fontWeight: 'bold', color: statusMessage.includes('Error') || statusMessage.includes('Failed') ? 'red' : 'green' }
  };

  return (
    <div style={styles.container}>
      {/* LEFT COLUMN: Editor */}
      <div style={styles.editorPanel}>
        <div style={styles.topCenter}>
          <h2>Program Schedule Editor</h2>
          <input
            type="date"
            style={styles.dateInput}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        {isLoading ? (
          <p>Loading schedule...</p>
        ) : (
          <div>
            {programs.map((prog, index) => (
              <div key={index} style={styles.programCard}>
                <button style={styles.removeBtn} onClick={() => handleRemoveProgram(index)}>✕</button>

                <div style={styles.inputGroup}>
                  <label>Program Name</label>
                  <input
                    style={styles.input} type="text" value={prog.name} placeholder="e.g. Let's Move! with Abby"
                    onChange={(e) => handleProgramChange(index, 'name', e.target.value)}
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label>Location Name</label>
                  <input
                    style={styles.input} type="text" value={prog.location} placeholder="e.g. Wonderground"
                    onChange={(e) => handleProgramChange(index, 'location', e.target.value)}
                  />
                </div>

                <div style={styles.row}>
                  <div style={{ ...styles.inputGroup, alignItems: 'center', gap: '10px', width: '70px', marginTop: '10px' }}>
                    <label>All day</label>
                    <input
                      style={styles.input} type="checkbox" checked={prog.allDay} onChange={(e) => handleProgramChange(index, 'allDay', e.target.checked)}
                    />
                  </div>
                  <div style={{ backgroundColor: '#868686', width: '1px' }}></div> {/* Divider between all-day toggle and time inputs */}

                  <div style={{
                    ...styles.inputGroup,
                    ...(prog.allDay ? styles.disabled : {}), // Applies disabled input styles
                    flex: 1,
                  }}>
                    <label>Start Time</label>
                    <input
                      style={styles.input} type="time" value={prog.startTime}
                      onChange={(e) => handleProgramChange(index, 'startTime', e.target.value)}
                    />
                  </div>

                  <div style={{ ...styles.inputGroup,
                    ...(prog.allDay ? styles.disabled : {}), // Applies disabled input styles
                    flex: 1, }}>
                    <label>End Time</label>
                    <input
                      style={styles.input} type="time" value={prog.endTime}
                      onChange={(e) => handleProgramChange(index, 'endTime', e.target.value)}
                    />
                  </div>
                </div>

                <div style={styles.inputGroup}>
                  <label>Floor Icon</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <select
                      style={{ ...styles.input, flex: 1 }}
                      value={prog.icon}
                      onChange={(e) => handleProgramChange(index, 'icon', e.target.value)}
                    >
                      {Object.keys(AVAILABLE_ICONS).map(iconKey => (
                        <option key={iconKey} value={iconKey}>
                          {iconKey}
                        </option>
                      ))}
                    </select>

                    {/* Visual preview of the selected icon */}
                    {AVAILABLE_ICONS[prog.icon] && (
                      <img
                        src={AVAILABLE_ICONS[prog.icon]}
                        alt={`Icon for ${prog.icon}`}
                        style={{ width: '30px', height: '30px', objectFit: 'contain' }}
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button style={{ ...styles.button, backgroundColor: '#28a745' }} onClick={handleAddProgram}>
                + Add Program
              </button>
              <button style={styles.button} onClick={handleSave}>
                Save Schedule
              </button>
            </div>

            {statusMessage && <p style={styles.status}>{statusMessage}</p>}
          </div>
        )}
      </div>

      {/* RIGHT COLUMN: Preview */}
      <div style={styles.previewPanel}>
        <h3 style={{ textAlign: 'center', marginBottom: '20px', color: '#555' }}>Live Preview</h3>
        {/* Pass the current form data directly into the calendar component for a live preview */}
        <CalendarPage previewDate={selectedDate} previewSchedule={programs} />
      </div>
    </div>
  );
}
