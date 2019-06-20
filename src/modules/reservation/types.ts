interface RequestOptions {
  id: string
  transactionKey?: string
}

interface CheckInOptions {
  checkIn: string
  nights: number
}


export interface CreateReservationOptions extends RequestOptions, CheckInOptions  {

}

export interface CancelReservationOptions extends RequestOptions, CheckInOptions {

}

export interface ModifyReservationOptions extends RequestOptions {
  from: CheckInOptions
  to: CheckInOptions
}
