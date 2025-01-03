export function Character(p: { src: string }) {
  return (
    <img
      src={p.src}
      style={{ width: "auto", height: "242px" }}
      className='fixed bottom-[21%] right-14 hidden xl:block'
    />
  );
}
