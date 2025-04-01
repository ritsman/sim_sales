// import * as React from "react";
// import { useEffect, useRef } from "react";
// import {
//   ScheduleComponent,
//   ViewsDirective,
//   ViewDirective,
//   TimelineMonth,
//   getWeekNumber,
//   Inject,
//   HeaderRowDirective,
//   HeaderRowsDirective,
//   Resize,
//   DragAndDrop,
//   getWeekLastDate,
// } from "@syncfusion/ej2-react-schedule";
// import { extend, Internationalization } from "@syncfusion/ej2-base";
// /**
//  * schedule header rows sample
//  */
// const WoScheduler = () => {
//   const scheduleObj = useRef(null);
//   const instance = new Internationalization();
//   const getMonthDetails = (value) => {
//     return instance.formatDate(value.date, { skeleton: "yMMMM" });
//   };
//   const getWeekDetails = (value) => {
//     return "Week " + getWeekNumber(getWeekLastDate(value.date, 0));
//   };
//   const monthTemplate = (props) => {
//     return <span className="month">{getMonthDetails(props)}</span>;
//   };
//   const weekTemplate = (props) => {
//     return <span className="week">{getWeekDetails(props)}</span>;
//   };
//   const onEventRendered = (args) => {
//     applyCategoryColor(args, scheduleObj.current.currentView);
//   };
//   return (
//     <div className="schedule-control-section">
//       <div className="col-lg-12 control-section">
//         <div className="control-wrapper">
//           <ScheduleComponent
//             ref={scheduleObj}
//             width="100%"
//             height="650px"
//             selectedDate={new Date(2021, 0, 1)}
//             eventRendered={onEventRendered}
//           >
//             <HeaderRowsDirective>
//               <HeaderRowDirective option="Month" template={monthTemplate} />
//               <HeaderRowDirective option="Week" template={weekTemplate} />
//               <HeaderRowDirective option="Date" />
//             </HeaderRowsDirective>
//             <ViewsDirective>
//               <ViewDirective option="TimelineMonth" interval={12} />
//             </ViewsDirective>
//             <Inject services={[TimelineMonth, Resize, DragAndDrop]} />
//           </ScheduleComponent>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default WoScheduler;
import * as React from "react";
import { useEffect, useRef } from "react";
import {
  ScheduleComponent,
  ViewsDirective,
  ViewDirective,
  TimelineMonth,
  ResourcesDirective,
  ResourceDirective,
  Inject,
  HeaderRowDirective,
  HeaderRowsDirective,
  Resize,
  DragAndDrop,
  getWeekLastDate,
} from "@syncfusion/ej2-react-schedule";
import { Internationalization } from "@syncfusion/ej2-base";

const WoScheduler = () => {
  const scheduleObj = useRef(null);
  const instance = new Internationalization();
  const products = [
    {
      name: "Product 1",
      startDate: new Date(2021, 1, 1),
      endDate: new Date(2021, 1, 5),
    },
    {
      name: "Product 2",
      startDate: new Date(2021, 1, 3),
      endDate: new Date(2021, 1, 8),
    },
    {
      name: "Product 3",
      startDate: new Date(2021, 1, 6),
      endDate: new Date(2021, 1, 10),
    },
  ];

  const resourceData = products.map((product) => ({
    Id: product.name,
    Text: product.name,
    StartDate: product.startDate,
    EndDate: product.endDate,
  }));

  const monthTemplate = (props) => {
    return (
      <span className="month">
        {instance.formatDate(props.date, { skeleton: "yMMMM" })}
      </span>
    );
  };

  return (
    <div className="schedule-control-section">
      <div className="col-lg-12 control-section">
        <div className="control-wrapper">
          <ScheduleComponent
            ref={scheduleObj}
            width="100%"
            height="650px"
            selectedDate={new Date(2021, 0, 1)}
          >
            <ResourcesDirective>
              <ResourceDirective
                field="Id"
                title="Products"
                name="Products"
                allowMultiple={true}
                dataSource={resourceData}
                textField="Text"
                idField="Id"
                groupIDField="GroupId"
              />
            </ResourcesDirective>
            <HeaderRowsDirective>
              <HeaderRowDirective option="Date" />
            </HeaderRowsDirective>
            <ViewsDirective>
              <ViewDirective option="TimelineMonth" interval={12} />
            </ViewsDirective>
            <Inject services={[TimelineMonth, Resize, DragAndDrop]} />
          </ScheduleComponent>
        </div>
      </div>
    </div>
  );
};

export default WoScheduler;
