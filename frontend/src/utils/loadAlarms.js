// utils/loadAlarms.js
import hardcore from '../assets/alarms/hardcore.wav';
import classic from '../assets/alarms/classic.wav';
import gambling from '../assets/alarms/gambling.wav';
import morning from '../assets/alarms/morning.wav';
import rooster from '../assets/alarms/rooster.wav';
// Add more alarm imports as necessary

export const loadAlarms = () => {
    return [
        { name: 'hardcore', path: hardcore },
        { name: 'classic', path: classic },
        { name: 'gambling', path: gambling },
        { name: 'morning', path: morning },
        { name: 'rooster', path: rooster },
       
        // Add more alarm entries as necessary
    ];
};
