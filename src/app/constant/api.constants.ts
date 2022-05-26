export const PROJECT_MANAGER = {
  searchProject: '/api/services/app/ProjectService/Filter',
};

export const APP_CONSTANT = {
  EnumProjectStatus: {
    Active: 0,
    Deactive: 1,
    All: 2
  },
  EnumProjectType: {
    Timeandmaterials: 0,
    Fixedfee: 1,
    Nonbillable: 2,
    ODC: 3
  },
  EnumTaskType: {
    Commontask: 0,
    Orthertask: 1
  },
  EnumUserType: {
    Member: 0,
    PM: 1,
    Shadow: 2,
    DeActive: 3
  },
  EnumTypeOfWork: {
    All: -1,
    Normalworkinghours: 0,
    Overtime: 1
  },
  TimesheetStatus: {
    All: -1,
    Draft: 0,
    Pending: 1,
    Approve: 2,
    Reject: 3
  },
  EnumDayOfWeek: {
    Monday: 0,
    Tuesday: 1,
    Wednesday: 2,
    Thursday: 3,
    Friday: 4,
    Saturday: 5,
    Sunday: 6
  },
  TimesheetViewBy: {
    Project: 0,
    People: 1
  },
  TypeViewHomePage: {
    Week: 0,
    Month: 1,
    Quater: 2,
    Year: 3,
    AllTime: 4,
    CustomTime: 5
  },
  MyTimesheetView: {
    Day: 0,
    Week: 1
  },
  MAX_WORKING_TIME: 600,
  CHECK_STATUS: {
    CHECKED_NONE: 0,
    CHECKED_SOME: 1,
    CHECKED_ALL: 2,
  },
  BRANCH: {
    HN: 0,
    DN: 1,
  },
  AbsenceStatus: {
    Pending: 1,
    Approved: 2,
    Rejected: 3
  },
  AbsenceType: {
    FullDay: 1,
    Morning: 2,
    Afternoon: 3,
    Custom:4
  }
};
