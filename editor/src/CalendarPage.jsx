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
    { startTime: '9:30', endTime: '10:30 am', name: 'Early Explorers Playgroup', location: 'Celebrations', icon: '2' },
    { startTime: '10', endTime: '11:30 am', name: 'Let’s Move! with Abby', location: 'Wonderground', icon: 'B' },
    { startTime: '10:30', endTime: '11 am', name: 'Music with Junebug', location: 'Celebrations', icon: 'Green' },
    { startTime: '1', endTime: '3 pm', name: 'Clay Day!', location: 'Art Studio', icon: '2' },
    { startTime: '1', endTime: '3 pm', name: 'Clay Day!', location: 'Art Studio', icon: '2' },
    { startTime: '1', endTime: '3 pm', name: 'Clay Day!', location: 'Art Studio', icon: '2' },
]

const fallBackSchedule = [
    {
        "icon": "R",
        "location": "Rooftop",
        "name": "Meet our animals"
    },
    {
        "icon": "2",
        "location": "Art Studio",
        "name": "Visit the Art Studio, find the color of the day!",
        "startTime": ""
    }
]

const calendarBackgroundStyle = {

    /* Base font size: 2vh means 2% of viewport height */
    /* For a 9:16 portrait display, this scales proportionally */

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

const calendarContentContainerStyle = {
    width: '85%',
    fontSize: '2vh',
    fontFamily: `AvenirNextMedium`,
    lineHeight: 1,
    alignItems: 'start',
    textAlign: 'left',
    padding: '2em',
    color: '#434b4c',
    position: 'relative',
    marginTop: '2em',
    top: '-8%', // anchors the schedule so it rises as it grows
}

const calendarTitleStyle = {
    fontFamily: 'AvenirNextHeavy', fontSize: '2.45em'
}

const calendarItemStyle = {
    marginBottom: '1.8em', display: 'flex', gap: '0.5em'
}

const calendarItemIconStyle = {
    width: '2.74em', height: 'auto', alignSelf: 'flex-start', objectFit: 'contain'
}


const calendarItemTitleStyle = {
    fontFamily: 'AvenirNextDemi', fontSize: '1.67em', margin: '0 0 0.2em 0'
}

const calendarItemDetailsStyle = {
    fontFamily: 'AvenirNextRegular', fontSize: '1.37em', margin: '0 0 0.2em 0'
}

const calendarItemTextAreaStyle = {
    display: 'flex', flexDirection: 'column'
}

const calendarPageDotsAreaStyle = {
    display: 'flex', justifyContent: 'center', marginTop: '1em'
}

const calendarPageDotsContainerStyle = {
    display: 'flex', gap: '0.5em', marginTop: '1em'
}

const calendarPageDotStyle = {
    width: '0.5em', height: '0.5em', borderRadius: '50%', backgroundColor: '#434b4c', opacity: 0.25
}

const calendarPageDotActiveStyle = {
    width: '0.5em', height: '0.5em', borderRadius: '50%', backgroundColor: '#434b4c', opacity: 0.75
}

function CalendarPage({ previewDate = '', previewSchedule = null }) {
    const [schedule, setSchedule] = useState(null);
    const [pageIndex, setPageIndex] = useState(0);

    const pageSize = 4; // Number of items to show per page
    const pageTimeout = 5000; // Time in milliseconds to show each page

    // Load schedule once on mount
    useEffect(() => {
        if (previewSchedule) {
            setSchedule(previewSchedule);
            return;
        }

        // setSchedule(testSchedule); // Set initial schedule
        fetchSchedule(); // Fetch real schedule from server

        const eventSource = new EventSource('/listen');

        eventSource.onmessage = (event) => {
            if (event.data === 'refresh') {
                console.log("Server said: Update!");
                fetchSchedule(); // Re-fetch the JSON data
            }
        };

        eventSource.onerror = () => {
            console.error("EventSource failed. Browser will try to reconnect automatically.");
        };

        return () => {
            eventSource.close(); // Hang up the "phone call" when the component unmounts
        };
    }, [previewSchedule]);

    // Rotate pages on a fixed interval after schedule is available.
    useEffect(() => {
        if (!schedule || schedule.length === 0) return;

        const tp = Math.ceil(schedule.length / pageSize);
        const intervalId = setInterval(() => {
            setPageIndex(prev => (prev + 1) % tp);
        }, pageTimeout);

        return () => clearInterval(intervalId);
    }, [schedule, pageSize, pageTimeout]);

    // Poll every few minutes as a backup in case the EventSource misses an update (which can happen if the connection drops and fails to reconnect)
    useEffect(() => {

        const intervalId = setInterval(() => {
            fetchSchedule();
        }, 5 * 60 * 1000); // Every 5 minutes

        return () => clearInterval(intervalId);
    }, []);

    async function fetchSchedule() {

        let todaySchedule = [];

        await fetch('/data/today').then(res => res.json())
            .then((today) => {
                console.log('Fetched today data:', today);
                todaySchedule = today.data
            })
            .catch(err => console.error('Error fetching schedule:', err))


        console.log('Fetched schedule:', todaySchedule);

        if (todaySchedule.length == 0) {
            console.warn('Schedule is empty or failed to load, using default data');
            await fetch('/data/default').then(res => res.json())
                .then(defaultData => todaySchedule = defaultData.data)
                .catch(err => console.error('Error fetching default data:', err))
        }
        if (todaySchedule.length == 0) {
            console.warn('Default data is also empty or failed to load, using hardcoded fallback schedule');
            todaySchedule = fallBackSchedule;
        }

        setSchedule(todaySchedule);
    }

    console.log("Date:", typeof previewDate, previewDate);
    console.log("Programs:", typeof schedule, schedule);

    return (
        <div style={centerPageStyle}>

            <div style={calendarBackgroundStyle}>
                {
                    schedule ? (
                        <div style={calendarContentContainerStyle}>
                            <p>{previewDate}</p>
                            <h2 style={calendarTitleStyle}>TODAY AT MCM</h2>
                            {schedule.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize).map((item, index) => (
                                <div key={index} style={calendarItemStyle}>
                                    <img style={calendarItemIconStyle} src={getFloorIcon(item.icon)} alt={`${item.icon} icon`} />
                                    <div style={calendarItemTextAreaStyle}>
                                        <h3 style={calendarItemTitleStyle}>{item.name}</h3>
                                        <p style={calendarItemDetailsStyle}>{buildTimeAndLocationString(item)}</p>
                                    </div>
                                </div>
                            ))}
                            {schedule.length > pageSize ? (
                                <div style={calendarPageDotsAreaStyle}>
                                    <div style={calendarPageDotsContainerStyle}>
                                        {Array.from({ length: Math.ceil(schedule.length / pageSize) }, (_, i) => (
                                            <span key={i} style={i === pageIndex ? calendarPageDotActiveStyle : calendarPageDotStyle} />
                                        ))}
                                    </div>
                                </div>
                            ) : ""
                            }

                        </div>

                    ) : (
                        <p style={{ fontFamily: 'AvenirNextHeavy' }}>Loading program calendar...</p>
                    )

                }

            </div>
        </div>
    )
}

function buildTimeAndLocationString(program) {
    let sections = [];
    if (program.allDay) {
        sections.push('All Day');
    }
    else if (program.startTime && program.endTime) {
        sections.push(`${formatTime(program.startTime)} – ${formatTime(program.endTime)}`);
    } else if (program.startTime) {
        sections.push(formatTime(program.startTime));
    } else if (program.endTime) {
        sections.push(`Open – ${formatTime(program.endTime)}`);
    }

    if (program.location) {
        sections.push(program.location);
    }
    return sections.join(', ');
}


function getFloorIcon(icon) {
    switch (icon) {
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

const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [h, m] = timeStr.split(':');
    const hInt = parseInt(h, 10);
    const ampm = hInt >= 12 ? 'PM' : 'AM';
    const hour = hInt % 12 || 12; // Converts "00" to "12" and "13" to "1"
    return `${hour}:${m} ${ampm}`;
  };

export default CalendarPage
