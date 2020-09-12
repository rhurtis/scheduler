import React from "react";
import "components/DayListItem.scss";
import classNames from 'classnames';

/*
The DayListItem requires the following props:
  -name:String the name of the day
  -spots:Number the number of spots remaining
  -selected:Boolean true or false declaring that this day is selected
  -setDay:Function accepts the name of the day eg. "Monday", "Tuesday"

The DayList component needs the following props.
  -days:Array a list of day objects (each object includes an id, name, and spots)
  -day:String the currently selected day
  -setDay:Function accepts the name of the day eg. "Monday", "Tuesday"
*/


export default function DayListItem(props) {
  const formatSpots = function () {
    if (props.spots === 0) {
      return 'no spots remaining'
    } else if (props.spots === 1) {
      return '1 spot remaining'
    } else  {
      return `${props.spots} spots remaining`
    }
  }

  const dayClass = classNames("day-list__item", {
    "day-list__item--selected": props.selected,
    "day-list__item--full": !props.spots    
  });

  return (
    <li className = {dayClass} onClick={() => props.setDay(props.name)} data-testid="day"> {/* Represents the entire DayListItem. */}
      <h2 className="text--regular">{props.name}</h2> {/** this will display the day name */}
      <h3 className="text--light">{formatSpots()}</h3> {/** This will display the spots remaining for the day. */}
    </li>
  );
}