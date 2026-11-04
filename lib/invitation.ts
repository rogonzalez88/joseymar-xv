export const invitation = {
  name: "Joseymar Billianny",
  fullName: "Joseymar Lugo",
  title: "Mis XV Años",
  families: ["Familia Lugo", "Familia Tovar"],
  // Venezuela (UTC-4)
  eventDate: "2026-11-07T20:00:00-04:00",
  // TEMPORAL (pruebas en producción): con false, subir fotos está habilitado a cualquier hora.
  // Volver a poner true antes de la fiesta para bloquearlo hasta eventDate.
  uploadLock: false,
  dateLabel: "Sábado 7 de noviembre de 2026",
  timeLabel: "8:00 pm",
  quote:
    "Te invito a ser parte de una noche que para mí será especial, inolvidable y compartida con quienes más quiero",
  venue: {
    name: "Salón de Festejos Virgen del Valle",
    address: "Av. Principal Lomas del Rosario, Santa Lucía, Estado Miranda",
    mapsUrl: "https://maps.app.goo.gl/TfnmKvzSFgwcizCf8",
  },
  // Itinerario de ejemplo: ajustar horarios y actividades según el evento real
  itinerary: [
    { time: "8:00 pm", title: "Recepción", description: "Bienvenida a los invitados" },
    {
      time: "8:30 pm",
      title: "Entrada de la quinceañera",
      description: "Joseymar hace su entrada triunfal",
    },
    { time: "8:50 pm", title: "Vals de honor", description: "El baile más esperado de la noche" },
    {
      time: "9:10 pm",
      title: "Brindis y palabras",
      description: "Unas palabras de la familia y un brindis por la quinceañera",
    },
    { time: "9:30 pm", title: "Cena", description: "Disfrutemos juntos de la cena" },
    { time: "10:30 pm", title: "¡Que empiece la fiesta!", description: "Música y baile para todos" },
  ],
  dressCode: {
    label: "Semi Formal o Formal",
    description:
      "Queremos verte elegante en esta noche tan especial.",
  },
};
