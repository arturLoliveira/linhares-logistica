interface ContactInfoProps {
    icon: React.ReactNode;
    info: string
}

function ContactInfo({ icon, info }:ContactInfoProps) {
    return (
        <div className='contactInfo'>
            {icon}
            <h3>{info}</h3>
        </div>
    )
}
export default ContactInfo