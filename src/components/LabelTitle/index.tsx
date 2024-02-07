interface LabelTitle {
  text: string;
  htmlFor: string;
  className: string;
  required?: boolean;
}

function LabelTitle({
  text,
  htmlFor,
  className,
  required = false,
}: LabelTitle) {
  return (
    <div className="flex align-items-center">
      <label htmlFor={htmlFor} className={className}>
        {text}
      </label>
      {required && (
        <span style={{ marginLeft: "2px", color: "var(--cor-primaria)" }}>
          *
        </span>
      )}
    </div>
  );
}

export default LabelTitle;
