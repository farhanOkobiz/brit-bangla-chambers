import CertificationUpdate from "./CertificationUpdate";
import AdvocateEducationUpdate from "./EducationUpdate";
import AdvocateDocumentUpdate from "./DocumentUpdate";


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