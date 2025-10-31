interface ContactInfoProps {
    icon: React.ReactNode;
    info: string
}

function ContactInfo({ icon, info }:ContactInfoProps) {
    return (
        <div className='contactInfo'>
            {icon}
            <h4>{info}</h4>
        </div>
    )
}
export default ContactInfo