export interface AppointmentCalendarListResultModel {
    requestId: string
    status: boolean
    messageCode: string
    message: string
    data: AppointmentCalendarData[]
  }
  
  export interface AppointmentCalendarData {
    id: number
    allday: boolean
    color: string
    textcolor: string
    title: string
    description: any
    start: string
    end: string
  }
  