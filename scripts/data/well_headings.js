var values = [];

values = [
  {
    locked:     true,
    minimal:    true,
    name:       'status',
    sortable:   true,
    type:       'status'
  },
  {
    direction:  'asc',
    locked:     true,
    name:       'Well_Name',
    sortable:   true,
    title:      'Well Name',
    type:       'string'
  },
  {
    name:       'Well_State_Text',
    resizable:  true,
    sortable:   true,
    title:      'Well State',
    type:       'string'
  },
  {
    name:       'Current_State_Time_Text',
    resizable:  true,
    sortable:   true,
    title:      'Current State Time',
    type:       'string'
  },
  {
    name:       'FG_Last_Received_Date',
    resizable:  true,
    sortable:   true,
    title:      'FG Last Received Date',
    type:       'date'
  },
  {
    name:       'well-actions',
    resizable:  false,
    sortable:   false,
    title:      'Actions',
    type:       'actions'
  }
];

module.exports = values;
