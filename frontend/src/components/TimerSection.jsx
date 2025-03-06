import { useSelector, useDispatch } from 'react-redux';
import { toggleTimer } from '../redux/timerSlice';
import Countdown from 'react-countdown';
import { useRef,useState, useEffect } from 'react';
import { Howl } from 'howler'; // Import Howler.js
import { resetCompletedPomodoros, incrementCompletedPomodoros } from '../redux/timerSlice';
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

    const toggleSound = new Howl({
        src: [ToggleFx],
        volume: 1,
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
                
                soundEffect.once('end', () => {
                    repeatCount++;
                    if (repeatCount < alarmRepeatCount) {
                        playAndWait(); // Play the next sound only after the previous one finishes
                    } else {
                        setIsPlaying(false); // Reset isPlaying when all repeats are done
                    }
                });
                soundEffect.play();
            };
    
            playAndWait();
        }
    };
    

    useEffect(() => {
        // Update the sound effect whenever the selected alarm or volume changes
        if (selectedAlarm) {
            setSoundEffect(new Howl({
                src: [selectedAlarm],
                volume: alarmVolume ?? 0.5,
            }));
        }
    }, [selectedAlarm, alarmVolume]);

    const handleToggle = () => {
        if (soundEffect) {
            soundEffect.stop();
            setIsPlaying(false); // Reset the playing state when toggling
        }
        
        if (isTimerActive) {
            countdownApiRef.current.pause();
        } else {
            countdownApiRef.current.stop();
            countdownApiRef.current.start();
        }
        
        dispatch(toggleTimer());
        toggleSound.play();

        // Additional code to stop the sound effect if it's playing
        shouldStop = true; // Set flag to true to stop any ongoing playback
        
    };

    const times = {
        'Pomodoro': pomodoroTime,
        'Short Break': shortBreakTime,
        'Long Break': longBreakTime,
    };

    const switchTimers = () => {
        playSoundEffect(); // Use the new play function
        if (activeTab === 'Pomodoro') {
            dispatch(incrementCompletedPomodoros());
            if (completedPomodoros >= pomodorosBeforeLongBreak) {
                setActiveTab('Long Break');
                dispatch(resetCompletedPomodoros());
            } else {
                setActiveTab('Short Break');
            }
        } else if (activeTab === 'Short Break') {
            setActiveTab('Pomodoro');
        }
        dispatch(toggleTimer());

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