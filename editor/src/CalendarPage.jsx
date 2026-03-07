import './App.css'
import calendarBackground1 from './assets/calendar-background-1.png'
import floorIcon1 from './assets/floorIcons/ElevatorButtonIcon-1.png'
import floorIcon2 from './assets/floorIcons/ElevatorButtonIcon-2.png'
import floorIconLL from './assets/floorIcons/ElevatorButtonIcon-LL.png'
import floorIconB from './assets/floorIcons/ElevatorButtonIcon-B.png'
import floorIconR from './assets/floorIcons/ElevatorButtonIcon-R.png'
import floorIconGreen from './assets/floorIcons/ElevatorButtonIcon-Green.png'
import floorIconOrange from './assets/floorIcons/ElevatorButtonIcon-Orange.png'
import { useState, useEffect } from 'react'

const testSchedule = [
    { startTime: '9:30', endTime: '10:30 am', name: 'Early Explorers Playgroup', location: 'Celebrations', floor: '2' },
    { startTime: '10', endTime: '11:30 am', name: 'Let’s Move! with Abby', location: 'Wonderground', floor: 'B' },
    { startTime: '10:30', endTime: '11 am', name: 'Music with Junebug', location: 'Celebrations', floor: 'Green' },
    { startTime: '1', endTime: '3 pm', name: 'Clay Day!', location: 'Art Studio', floor: '2' },
]

const containerStyle = {

    /* Base font size: 2vh means 2% of viewport height */
    /* For a 9:16 portrait display, this scales proportionally */
    fontSize: '2vh',

    fontFamily: `AvenirNextMedium`,
    lineHeight: 1,
    fontWeight: 400,

    display: 'flex',
    flexDirection: 'column',

    alignItems: 'center',
    justifyContent: 'center',

    // width: '100%',
    height: '100vh',
    aspectRatio: '9 / 16', /* Locks to 9:16 portrait ratio */

    backgroundImage: `url(${calendarBackground1})`,
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',

}

const centerPageStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100vh',
}

const contentContainerStyle = {
    alignItems: 'start',
    textAlign: 'left',
    padding: '2em',
    color: '#434b4c'
}

function CalendarPage() {
    const [schedule, setSchedule] = useState(null);

    useEffect(() => {
        // Disable until backend is ready
        setSchedule(testSchedule);
        // fetch('/data/today').then(res => res.json())
        //     .then(data => setSchedule(data))
        //     .catch(err => console.error('Error fetching schedule:', err))
    }, []);

    return (
        <div style={centerPageStyle}>

            <div style={containerStyle}>
                {
                    schedule ? (
                        <div style={contentContainerStyle}>
                            <h2 style={{ fontFamily: 'AvenirNextHeavy', fontSize: '2.5em' }}>TODAY AT MCM</h2>
                            {schedule.map((item, index) => (
                                <div key={index} style={{ marginBottom: '1.8em', display: 'flex', gap: '0.5em' }}>

                                    {/* <img src={`./assets/floorIcons/ElevatorButtonIcon-${item.floor}.png`} alt={`${item.floor} icon`} style={{ width: '4vh', height: '4vh' }} /> */}
                                    <img style={{width: '2.7em', height: 'auto', alignSelf: 'flex-start', objectFit: 'contain'}} src={getFloorIcon(item.floor)} alt={`${item.floor} icon`}  />
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <h3 style={{ fontFamily: 'AvenirNextDemi', fontSize: '1.7em', margin: '0 0 0.2em 0' }}>{item.name}</h3>
                                        <p style={{ fontFamily: 'AvenirNextRegular', fontSize: '1.2em', margin: '0 0 0.2em 0' }}>{item.startTime}{item.endTime ? ` – ${item.endTime}` : ''}, {item.location}</p>
                                    </div>
                                </div>
                            ))}

                        </div>
                    ) : (
                        <p style={{ fontFamily: 'AvenirNextHeavy' }}>Loading program calendar...</p>
                    )

                }

            </div>
        </div>
    )
}

function getFloorIcon(floor) {
    switch (floor) {
        case '1':
            return floorIcon1;
        case '2':
            return floorIcon2;
        case 'LL':
            return floorIconLL;
        case 'B':
            return floorIconB;
        case 'R':
            return floorIconR;
        case 'Green':
            return floorIconGreen;
        case 'Orange':
            return floorIconOrange; 
        default:
            return null; // or a default icon
    }
}

export default CalendarPage
