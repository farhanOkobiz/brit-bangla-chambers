import CertificationUpdate from "./CertificationUpdate";
import AdvocateEducationUpdate from "./AdvocateEducationUpdate";

export default function AdvocateUpdateAdditionalInfo({ id }) {
  return (

    <>
    <CertificationUpdate id={id} />
    <AdvocateEducationUpdate id={id} />
    
    </>
  )
  
  ;

}