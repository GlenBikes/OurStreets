import sys

from requests_html import HTMLSession
session = HTMLSession()

CSRF_FIELD = '__RequestVerificationToken'
# we just use all cookies so this isn't actually needed
# CSRF_COOKIE = '__RequestVerificationToken'


def lookup_plate(jurisdiction, state, number):
    resp = session.get(f'https://dspayments.com/{jurisdiction}')
    print(f'https://dspayments.com/{jurisdiction}',
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
                         resp.cookies)
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
    if error:
        return {'error': error.element.text}
    # TODO - parse resp.html & return

if __name__ == '__main__':
    # ./dspayments.py Fairfax dc 69
    lookup_plate(*sys.argv[1:])
