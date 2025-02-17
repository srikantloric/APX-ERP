// export type admitCardType = {
//     examTitle: string;
//     session: string;
//     startTime: string;
//     endTime: string;
//     timeTabel: {
//         date: Date;
//         firstMeeting: string;
//         secondMeeting: string;
//     }[];
// }

export interface admitCardType {
    studentName: string;
    rollNumber: string;
    className: string;
    fatherName: string;
    studentDOB: string;
    studentMob: string;
    profile_url: string;
    examTitle: string;
    session: string;
    startTime: string;
    endTime: string;
    timeTabel: {
        date: Date;
        firstMeeting: string;
        secondMeeting: string;
    }[];
}