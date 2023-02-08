export interface IDateSendProps {
  date: string;
}

export default function DateSend({ date }: IDateSendProps) {
  return (
    <p style={{ color: "#d1d1d1 ", textAlign: "center", fontSize: "14px" }}>
      {date}
    </p>
  );
}
