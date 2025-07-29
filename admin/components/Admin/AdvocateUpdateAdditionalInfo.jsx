import CertificationUpdate from "./CertificationUpdate";
import AdvocateEducationUpdate from "./AdvocateEducationUpdate";
import AdvocateDocumentUpdate from "./AdvocateDocumentUpdate";


export default function AdvocateUpdateAdditionalInfo({ id }) {
  return (

    <>
    <CertificationUpdate id={id} />
    <br />
    <AdvocateEducationUpdate id={id} />
    <br />
    <AdvocateDocumentUpdate id = { id } />
    </>
  )
  
  ;

}