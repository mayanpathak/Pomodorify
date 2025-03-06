// SettingsModal.js
import { ZincButton, HeaderText, SecondaryText, SmallNumberInput, SliderInput, DropdownInput } from "./InputFields";
import { useState, useEffect } from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { updatePomodoroTime, updateShortBreakTime, updatePomodorosBeforeLongBreak, updateLongBreakTime } from '../redux/timerSlice';


import { setAlarmRepeatCount, setSelectedAlarm, setAlarmList } from '../redux/timerSlice';
import { loadAlarms } from '../utils/loadAlarms';

export default function SettingsModal() {
  const dispatch = useDispatch();
  const [sliderValue, setSliderValue] = useState(40); // Initial value
  const [pomodoro, setPomodoro] = useState(25);
  const [shortBreak, setShortBreak] = useState(5);
  const [longBreak, setLongBreak] = useState(15);
  const [pomodorosBeforeBreak, setPomodorosBeforeBreak] = useState(4); // Initial value
  const [alarmRepeat, setAlarmRepeat] = useState(1); // Default to 1


  // Fixing onChange handlers to handle number inputs properly
  const handlePomodoroChange = (e) => setPomodoro(Number(e.target.value));
  const handleShortBreakChange = (e) => setShortBreak(Number(e.target.value));
  const handleLongBreakChange = (e) => setLongBreak(Number(e.target.value));

  const handleSave = () => {
    dispatch(updatePomodoroTime(pomodoro));
    dispatch(updateShortBreakTime(shortBreak));
    dispatch(updateLongBreakTime(longBreak));
    dispatch(updatePomodorosBeforeLongBreak(pomodorosBeforeBreak)); // Properly update long break setting
    document.getElementById("my_modal_1").close(); 
 };

  const handleSliderChange = (value) => {
    setSliderValue(value);
  };

  const alarmList = useSelector((state) => state.timer.alarmList);
  const selectedAlarm = useSelector((state) => state.timer.selectedAlarm);
  
  useEffect(() => {
    const alarms = loadAlarms();
    if (alarms && alarms.length > 0) {
        dispatch(setAlarmList(alarms));

        // Ensure the default 'hardcore' alarm is set
        const defaultAlarm = alarms.find(alarm => alarm.name === 'hardcore');
        if (defaultAlarm) {
            dispatch(setSelectedAlarm(defaultAlarm.path));
        }
    }
}, [dispatch]);

  const handleAlarmRepeatChange = (e) => {
    const repeatCount = Number(e.target.value);
    setAlarmRepeat(repeatCount);
    dispatch(setAlarmRepeatCount(repeatCount));
  };

  

  const handleAlarmChange = (newValue) => {
    // Ensure newValue is not undefined
    if (newValue) {
      dispatch(setSelectedAlarm(newValue));
    }
  };

    return (
      <dialog id="my_modal_1" className="modal flex justify-center items-center">
        <div className="modal-box bg-zinc-50 w-1/2 transform -translate-x-3"> {/* Adjust -translate-x-3 for positioning */}
        <button className="btn btn-sm bg-zinc-700 btn-circle absolute right-2 top-2">✕</button>

          <h3 className="font-bold text-lg mb-4 text-zinc-400 text-center">Setting</h3>
                <div className="text-left">
                </div>

              <div className="py-5 border-b border-t border-zinc-300">
                <HeaderText value={"TIMER"} color={"text-zinc-400 my-3"}/>            
                  <HeaderText value={"Time(minutes)"} color={"my-3 text-zinc-700"}/>

                  <div className="flex justify-between">
                        <SecondaryText value="Pomodoro" />
                        <SecondaryText value="Short Break" />
                        <SecondaryText value="Long Break" />                  
                  </div>
                  <div className="flex py-1 justify-between">
                  <SmallNumberInput value={pomodoro} onChange={handlePomodoroChange} />
                  <SmallNumberInput value={shortBreak} onChange={handleShortBreakChange} />
                  <SmallNumberInput value={longBreak} onChange={handleLongBreakChange} />
                  </div>
                  <div className="flex py-6 justify-between">
                    <HeaderText value={"Long Breaks interval"} color={"my-2 text-zinc-700"}/>
                    <SmallNumberInput 
                      value={pomodorosBeforeBreak} 
                      onChange={(e) => setPomodorosBeforeBreak(Number(e.target.value))} 
                    />                    
                    </div>
              </div>  


              <div className="py-5  border-b border-zinc-300">
                <HeaderText value={"SOUND"} color={"text-zinc-400 my-3"}/>            
                  <div className="flex py-6 justify-between">
                    <HeaderText value={"Alarm Sound"} color={" text-zinc-700"}/>
                    <DropdownInput 
                        items={alarmList.map(alarm => ({ label: alarm.name, value: alarm.path }))} // Ensure each item has a unique value
                        selectedValue={selectedAlarm}
                        onChange={handleAlarmChange}
                      />



                  </div>
                  <div className="flex justify-end pb-3">
                    <SecondaryText value={"repeat"}  />
                    <SmallNumberInput value={alarmRepeat} onChange={handleAlarmRepeatChange} />

                  </div>
                  <div className="flex justify-end py-3">
                    <SliderInput defaultValue={sliderValue} onChange={handleSliderChange} />

                  </div>
              </div>  
                


          <div className="modal-action">
            <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
              {/* if there is a button in form, it will close the modal */}
              <ZincButton value="Save" onClick={handleSave} />
            </form> 
          </div>
        </div>
      </dialog>
    );
  }