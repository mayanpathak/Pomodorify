import { useSelector, useDispatch } from 'react-redux';
import { 
    toggleTimer,
    resetCompletedPomodoros, 
    incrementCompletedPomodoros,
    startPomodoroSession,
    endPomodoroSession,
    fetchUserSettings
} from '../redux/timerSlice';
import { incrementTaskPomodoroAsync } from '../redux/taskSlice';
import Countdown from 'react-countdown';
import { useRef, useState, useEffect } from 'react';
import { Howl } from 'howler'; // Import Howler.js
import ToggleFx from "../assets/switch.mp3"

export default function TimerSection({activeTab, setActiveTab}) {
    const dispatch = useDispatch();
    const isTimerActive = useSelector((state) => state.timer.toggleTimer);
    const pomodoroTime = useSelector((state) => state.timer.pomodoroTime);
    const shortBreakTime = useSelector((state) => state.timer.shortBreakTime);
    const longBreakTime = useSelector((state) => state.timer.longBreakTime);
    const completedPomodoros = useSelector((state) => state.timer.completedPomodoros);
    const pomodorosBeforeLongBreak = useSelector((state) => state.timer.pomodorosBeforeLongBreak);
    const countdownApiRef = useRef();
    const selectedAlarm = useSelector((state) => state.timer.selectedAlarm);
    const alarmVolume = useSelector((state) => state.timer.alarmVolume);
    const alarmRepeatCount = useSelector((state) => state.timer.alarmRepeatCount);
    const [soundEffect, setSoundEffect] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const currentSession = useSelector((state) => state.timer.currentSession);
    const highlightedTaskId = useSelector((state) => state.tasks.highlightedTaskId);
    const timerStatus = useSelector((state) => state.timer.status);

    // Fetch user settings on component mount
    useEffect(() => {
        if (timerStatus === 'idle') {
            dispatch(fetchUserSettings());
        }
    }, [dispatch, timerStatus]);

    // Use built-in beep as fallback
    const playBeepSound = () => {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.type = 'sine';
            oscillator.frequency.value = 800;
            gainNode.gain.value = alarmVolume || 0.5;
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.start();
            setTimeout(() => {
                oscillator.stop();
            }, 200);
        } catch (error) {
            console.error('Failed to play beep sound:', error);
        }
    };

    // Initialize toggle sound with error handling
    const toggleSound = new Howl({
        src: [ToggleFx],
        volume: 0.5,
        format: ['mp3'],
        onloaderror: () => {
            console.warn('Failed to load toggle sound, using fallback');
        }
    });

    const playSoundEffect = () => {
        if (soundEffect && !isPlaying) {
            setIsPlaying(true);
            let repeatCount = 0;
            let shouldStop = false; // Flag to control stopping
    
            const playAndWait = () => {
                if (shouldStop) {
                    setIsPlaying(false); // Stop playback if flagged
                    return;
                }
                
                // Try to play with Howler, fallback to beep if it fails
                try {
                    soundEffect.once('end', () => {
                        repeatCount++;
                        if (repeatCount < alarmRepeatCount) {
                            playAndWait(); // Play the next sound only after the previous one finishes
                        } else {
                            setIsPlaying(false); // Reset isPlaying when all repeats are done
                        }
                    });
                    soundEffect.play();
                } catch (error) {
                    console.error('Error playing sound, using fallback beep:', error);
                    playBeepSound();
                    repeatCount++;
                    if (repeatCount < alarmRepeatCount) {
                        setTimeout(playAndWait, 500);
                    } else {
                        setIsPlaying(false);
                    }
                }
            };
    
            playAndWait();
        } else {
            // If no sound effect is available, use the beep
            for (let i = 0; i < (alarmRepeatCount || 1); i++) {
                setTimeout(() => playBeepSound(), i * 500);
            }
        }
    };
    

    useEffect(() => {
        let audio;
        try {
            // Load the alarm sound from settings or use default
            const alarms = loadAlarms();
            const alarmPath = alarms.find(alarm => alarm.name === selectedAlarm)?.path || alarms[0].path;
            
            audio = new Audio(alarmPath);
            
            // Preload the audio
            audio.load();
            
            // Check if the audio is loaded correctly
            audio.addEventListener('canplaythrough', () => {
                console.log('Alarm sound loaded successfully:', selectedAlarm);
                setSoundEffect(audio);
            });
            
            // Handle loading errors
            audio.addEventListener('error', (e) => {
                console.error('Failed to load alarm sound:', e);
                // Create a fallback beep using the oscillator
                playBeepSound();
            });
            
        } catch (error) {
            console.log('Failed to load alarm sound, will use fallback beep');
            playBeepSound();
        }
        
        // Cleanup function
        return () => {
            if (audio) {
                audio.removeEventListener('canplaythrough', () => {});
                audio.removeEventListener('error', () => {});
            }
        };
    }, [selectedAlarm, alarmVolume]);

    const handleToggle = () => {
        if (soundEffect) {
            try {
                soundEffect.pause();
            } catch (error) {
                console.error('Error stopping sound:', error);
            }
            setIsPlaying(false); // Reset the playing state when toggling
        }
        
        if (isTimerActive) {
            countdownApiRef.current.pause();
            
            // If we're stopping an active session, end it in the backend
            if (currentSession) {
                dispatch(endPomodoroSession({
                    sessionId: currentSession._id,
                    completed: false
                }));
            }
        } else {
            countdownApiRef.current.stop();
            countdownApiRef.current.start();
            
            // Start a new session in the backend
            dispatch(startPomodoroSession({
                taskId: highlightedTaskId,
                sessionType: activeTab
            }));
        }
        
        dispatch(toggleTimer());
        
        // Try to play toggle sound with fallback
        try {
            toggleSound.play();
        } catch (error) {
            console.error('Error playing toggle sound:', error);
            playBeepSound();
        }
    };

    const times = {
        'Pomodoro': pomodoroTime,
        'Short Break': shortBreakTime,
        'Long Break': longBreakTime,
    };

    const switchTimers = () => {
        playSoundEffect(); // Use the play function
        
        // End the current session
        if (currentSession) {
            dispatch(endPomodoroSession({
                sessionId: currentSession._id,
                completed: true
            }));
        }
        
        if (activeTab === 'Pomodoro') {
            dispatch(incrementCompletedPomodoros());
            
            // If a task is highlighted, increment its pomodoro count
            if (highlightedTaskId) {
                dispatch(incrementTaskPomodoroAsync(highlightedTaskId));
            }
            
            if (completedPomodoros >= pomodorosBeforeLongBreak - 1) {
                setActiveTab('Long Break');
                dispatch(resetCompletedPomodoros());
            } else {
                setActiveTab('Short Break');
            }
        } else if (activeTab === 'Short Break' || activeTab === 'Long Break') {
            setActiveTab('Pomodoro');
        }
        
        dispatch(toggleTimer());
        
        // Start a new session after switching
        setTimeout(() => {
            if (!isTimerActive) {
                dispatch(startPomodoroSession({
                    taskId: highlightedTaskId,
                    sessionType: activeTab
                }));
                dispatch(toggleTimer());
            }
        }, 1000);
    };
    
    // Renderer for the Countdown
    const renderer = ({ minutes, seconds }) => (
        <h2 className="font-bold text-8xl lg:text-9xl center-item h-52">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </h2>
    );

    return (
        <>  
        {/* ++ flex justify-center<div></div> */}
        <div className="flex justify-center mt-7">
            {/* --bg -base 100*/}
            {/* ++ lg:w-9/12  */}
            <div className="card  off-white lg:w-9/12 md:w-7/12 w-9/12 shadow-xl">
           {/* remove figure*/}
            <div className="card-body items-center text-center">
                {/* Title */}
                <div className="flex flex-col items-center">
                    {/* ++ card here */}
                    {/* ++ flex flex-col items-center<div></div> */}
                    <div role="tablist" className="tabs tabs-bordered">
                    {/* ++ text-base and font-bold and text-white*/}
                    {/* make pomodor default checked */}
                    {/* ++checked={activeTab === 'Pomodoro'} onClick={() => setActiveTab('Pomodoro')} mx-3*/}
                    <input type="radio" name="my_tabs_1" role="tab" className="text-white tab font-bold mx-3 text-sm sm:text-xs lg:text-base"aria-label="Pomodoro" checked={activeTab === 'Pomodoro'} onChange={() => setActiveTab('Pomodoro')} />
                    <div role="tabpanel" className="tab-content ">
                        {/* ++ font-bold text-8xl lg:text-9xl center-item h-52 */}
                        {activeTab === 'Pomodoro' && (
                            <Countdown
                                key={pomodoroTime} 
                                date={Date.now() + times['Pomodoro']}
                                ref={countdownApiRef} // Reference for control
                                autoStart={false}
                                renderer={renderer}
                                onComplete={switchTimers}
                            />
                        )}        
                    </div>
            
                    <input type="radio" name="my_tabs_1" role="tab" className="text-white tab font-bold mx-3 text-sm sm:text-xs lg:text-base" aria-label="Short Break" checked={activeTab === 'Short Break'}  onChange={() => setActiveTab('Short Break')} />
                    <div role="tabpanel" className="tab-content center-item ">

                        {activeTab === 'Short Break' && (
                            <Countdown
                                key={shortBreakTime} 
                                date={Date.now() + times['Short Break']}
                                ref={countdownApiRef} // Reference for control
                                autoStart={false}
                                renderer={renderer}
                                 onComplete={switchTimers}
                            />
                        )}
                        {/* <h2 className="font-bold text-8xl lg:text-9xl center-item h-52">05:00</h2> */}
                    </div>
            
                    <input type="radio" name="my_tabs_1" role="tab" className="text-white tab font-bold mx-3 text-sm sm:text-xs lg:text-base" aria-label="Long Break" checked={activeTab === 'Long Break'}  onChange={() => setActiveTab('Long Break')} />
                        <div role="tabpanel" className="tab-content center-item ">

                            {activeTab === 'Long Break' && (
                                <Countdown
                                    key={longBreakTime} 
                                    date={Date.now() + times['Long Break']}
                                    ref={countdownApiRef} // Reference for control
                                    autoStart={false}
                                    renderer={renderer}
                                    onComplete={switchTimers}
                                />
                            )}                   
                        </div>
                    </div>
                    </div>
                <div className="card-actions">
                    {/* ++  btn-wide  text-2xl text-zinc-700*/}
                    {isTimerActive ? (
                    <a 
                        onClick={handleToggle} 
                        className="mt-2 w-48 text-2xl hover:bg-slate-50 bg-slate-50 text-zinc-700 btn border-slate-50 font-bold"
                    > PAUSE
                    </a>
                    ) : (
                        <>
                        <div className="pb-2 bg-zinc-400 rounded-box">
                            <a 
                                onClick={handleToggle} 
                                className="w-48 text-2xl hover:bg-slate-50  text-zinc-700 bg-slate-50 btn border-slate-50 font-bold"
                            > START
                            </a>
                        </div>
                        </>                 
                    )}
                </div>
            </div>
            </div>
        </div>
        </>
    )
}