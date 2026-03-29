interface Props {
  src: string;
  alt: string;
}

const ImageDisplay = ({ src, alt }: Props) => (
  <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
    <img src={src} alt={alt} className="h-full w-full object-cover" />
  </div>
);

export default ImageDisplay;
