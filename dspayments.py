import sys
import sqlite3
import pandas as pd
from requests_html import HTMLSession
session = HTMLSession()

CSRF_FIELD = '__RequestVerificationToken'
# we just use all cookies so this isn't actually needed
# CSRF_COOKIE = '__RequestVerificationToken'


def save_html(city, state, number, html):
    Html_file = open("test_output/{}_{}_{}.html".format(city, state, number),"w")
    Html_file.write(html)
    Html_file.close()


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
        save_html(jurisdiction, state, number, resp.html.html)
    # TODO - parse resp.html & return


if __name__ == '__main__':
    # Establish Connection
    con= sqlite3.connect(r'archive.db')
    cur = con.cursor() 
    # Get unique list of plates
    df = pd.read_sql("""SELECT DISTINCT
                    state,
                    number
                    FROM tweets
                    /* remove hack license plates*/
                    WHERE (number NOT IN ('NOTAGS', 'notag', 'na', '')) OR
                          number is NOT NULL;
                    """, con=con)

    for enum, row in df.iterrows():
        print(enum)
        lookup_plate('Fairfax',row['state'], row['number'])