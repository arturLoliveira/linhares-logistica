import "../index.css"

interface buttonProps {
    icon: React.ReactNode
    title: string
}


function ContactButton({ icon, title }: buttonProps) {
    return(
        <button className="contact-button">
        {icon}
        <h3>{title}</h3>

        </button>
    )
}
export default ContactButton;