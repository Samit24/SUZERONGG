import { MdArrowOutward, MdLockOutline } from "react-icons/md";

interface Props {
  title: string;
  lines: string[];
  link?: string;
}

// A terminal-style "screenshot" for each project, drawn in code instead of an image.
const Terminal = ({ title, lines, link }: Props) => (
  <div className="term">
    <div className="term-bar">
      <span className="term-dot"></span>
      <span className="term-dot"></span>
      <span className="term-dot"></span>
      <span className="term-name">{title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}</span>
    </div>
    <div className="term-body">
      {lines.map((line, i) => (
        <div
          key={i}
          className={`term-line ${line.startsWith("$") || line.startsWith("#") ? "term-cmd" : ""} ${
            /MALICIOUS|CRITICAL|HIGH/.test(line) ? "term-alert" : ""
          }`}
          style={{ animationDelay: `${i * 0.12}s` }}
        >
          {line}
        </div>
      ))}
      <div className="term-line term-cursor">▍</div>
    </div>
    <div className="work-link">{link ? <MdArrowOutward /> : <MdLockOutline />}</div>
  </div>
);

const ProjectCover = (props: Props) => (
  <div className="work-image">
    {props.link ? (
      <a
        className="work-image-in"
        href={props.link}
        target="_blank"
        rel="noopener noreferrer"
        data-cursor="disable"
        aria-label={`${props.title} on GitHub`}
      >
        <Terminal {...props} />
      </a>
    ) : (
      <div className="work-image-in work-private" title="Internal work project" data-cursor="disable">
        <Terminal {...props} />
      </div>
    )}
  </div>
);

export default ProjectCover;
