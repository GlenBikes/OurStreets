import sys
from requests_html import HTMLSession
import json

session = HTMLSession()

CSRF_FIELD = '__RequestVerificationToken'
# we just use all cookies so this isn't actually needed
# CSRF_COOKIE = '__RequestVerificationToken'


def parse_html(city, state, number, html):
    citations = html.find('script', containing='citations')
    citations_text = citations[0].text.split('[')[1].split(']')[0].strip()
    citation_json = json.loads("[{}]".format(citations_text))
    citation_list = []
    for citation in citation_json:
        ticket = citation['IssueNo']
        plate =  citation['LicensePlateNumber']
        state = citation['LicStateProv']
        issue_date = citation['DisplayFields']['ISSUEDATE']
        issue_type = citation['IssueType']
        amount_due = citation['AmountDue']
        citation_list.append([city, ticket, plate, state, issue_date, issue_type, amount_due])
    return citation_list


def lookup_plate(jurisdiction, state, number):
    resp = session.get(f'https://dspayments.com/{jurisdiction}')
    '''print(f'https://dspayments.com/{jurisdiction}',
                         {
                             CSRF_FIELD: resp.html.find(
                                 f"[name={CSRF_FIELD}]", first=True).element.value,
                             'CSRF_FIELD'
                             'SearchType': 'Citation',
                             'SearchTypeAccordian': 'Citation',
                             'CitationNumber': '',
                             'Plate': str(number),
                             'PlateStateProv': state.upper(),
                             'submit': 'Search',
                         },
                         resp.cookies)'''
    resp = session.post(f'https://dspayments.com/{jurisdiction}',
                         data={
                             CSRF_FIELD: resp.html.find(
                                 f"[name={CSRF_FIELD}]", first=True).element.value,
                             'CSRF_FIELD'
                             'SearchType': 'Citation',
                             'SearchTypeAccordian': 'Citation',
                             'CitationNumber': '',
                             'Plate': str(number),
                             'PlateStateProv': state.upper(),
                             'submit': 'Search',
                         },
                         cookies=resp.cookies)
    error = resp.html.find('.alert_msg_error', first=True)
    if "We're sorry" in error.text:
        return {'error': error.element.text}
    else:
        # parse resp.html & return
        return parse_html(jurisdiction, state, number, resp.html)


if __name__ == '__main__':
     # ./dspayments.py Fairfax dc 69 
    lookup_plate(*sys.argv[1:]) 
