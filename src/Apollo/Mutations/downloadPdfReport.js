import gql from 'graphql-tag';

const DOWNLOAD_PDF_REPORT_MUTATIONS = gql`
  mutation Bioflux0downloadPdfReport($id: ID, $studyFid: Int, $reportType: String, $eventFid: Int, $reportId: Int, $markAsDownloaded: Boolean) {
    Bioflux0downloadPdfReport(
      id: $id,
      studyFid: $studyFid,
      reportType: $reportType,
      eventFid: $eventFid,
      reportId: $reportId,
      markAsDownloaded: $markAsDownloaded
    ) {
      isSuccess
      message
      url
      id
    }
  }
`;

export default DOWNLOAD_PDF_REPORT_MUTATIONS;
