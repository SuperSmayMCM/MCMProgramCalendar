import './App.css'
import calendarBackground1 from './assets/calendar-background-1.png'
import { useState } from 'react'

const containerStyle = {

    /* Base font size: 2vh means 2% of viewport height */
    /* For a 9:16 portrait display, this scales proportionally */
    fontSize: '2vh',

    fontFamily: `AvenirNextMedium`,
    lineHeight: 1.5,
    fontWeight: 400,

    display: 'flex',
    flexDirection: 'column',

    alignItems: 'center',
    justifyContent: 'center',

    width: '100%',
    height: '100vh',
    aspectRatio: '9 / 16', /* Locks to 9:16 portrait ratio */

    backgroundImage: `url(${calendarBackground1})`,
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
}

function CalendarPage() {
    const [schedule, setSchedule] = useState(null);

    fetch('/data/today').then(res => res.json())
        .then(data => setSchedule(data))
        .catch(err => console.error('Error fetching schedule:', err))

    return (
        <div style={containerStyle}>
            {
                schedule ? (
                    <div>
                        <h2 style={{ fontFamily: 'AvenirNextHeavy' }}>Today's Schedule</h2>
                        <ul>
                            {schedule.map((item, index) => (
                                <li key={index}>{item.time} - {item.event}</li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <p style={{ fontFamily: 'AvenirNextHeavy' }}>Loading program calendar...</p>
                )

            }

        </div>
    )
}

export default CalendarPage
