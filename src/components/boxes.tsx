import "../index.css"
interface BoxItemProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

function Boxes({ icon, title, description }: BoxItemProps) {
    return(
         <div className='box-cargas'>
            {icon}
            <h3>{title}</h3>
            <p>{description}</p>
         </div>
    )
}
export default Boxes;
