export default
[
  {
    name: '事業者1',
    id: 1,
    type: 'op',
    children: [
      {
        name: '加盟店1',
        id: 12,
        type: 'mc',
        children: [
          {
            name: '店舗1',
            type: 'st',
            children: [
              {
                name: '10',
                type: 'tm'
              }
            ]
          },
          {
            name: '店舗2',
            type: 'st',
            children: [
              {
                name: '20',
                type: 'tm'
              }
            ]
          }
        ]
      }
    ]
  }
]