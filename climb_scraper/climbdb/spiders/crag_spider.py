import scrapy


# TODO Learn virtual env
from scrapy.loader import ItemLoader

from climbdb.items import CragItem, ClimbItem
from climbdb.loaders import CragLoader, ClimbLoader

from climbdb.items import CragDjango


class ClimbSpider(scrapy.Spider):
    name = "climbs"

    def start_requests(self):
        urls = [
            'http://climbnz.org.nz/nz/si/canterbury/port-hills/ampitheatre-wall/',
        ]
        for url in urls:
            yield scrapy.Request(url=url, callback=self.parse)

    def parse(self, response):
        for href in response.xpath('//tr/td/div/a/@href').extract():
            yield scrapy.Request(response.urljoin(href),
                                 callback=self.parse_climb)

    def parse_climb(self, response):
        l = ClimbLoader(item=ClimbItem(), response=response)
        l.add_xpath('name', '//h1/text()')
        l.add_xpath('description', '//div/p/text()')
        return l.load_item()

class CragSpider(scrapy.Spider):
    name = "crags"

    def start_requests(self):
        urls = [
            'http://climbnz.org.nz/crags',
        ]
        for url in urls:
            yield scrapy.Request(url=url, callback=self.parse)

    def parse(self, response):
        for href in response.xpath('//div/ul/li/div/span/a/@href').extract():
            yield scrapy.Request(response.urljoin(href),
                                 callback=self.parse_crag)

    def parse_crag(self, response):
        l = CragLoader(item=CragItem(), response=response)
        l.add_xpath('name', '//title/text()')
        l.add_xpath('description', "//div[contains(@class, 'description')]/p/text()")
        return l.load_item()

# TODO Merge with above spider
class CragSpiderDjango(scrapy.Spider):
    name = 'crags_django'

    def start_requests(self):
        urls = [
            'http://climbnz.org.nz/crags',
        ]
        for url in urls:
            yield scrapy.Request(url=url, callback=self.parse)

    def parse(self, response):
        for href in response.xpath('//div/ul/li/div/span/a/@href').extract():
            yield scrapy.Request(response.urljoin(href),
                                 callback=self.parse_crag)

    def parse_crag(self, response):
        title = response.xpath('//title/text()').extract_first().split(' |')[0]
        description = '\n'.join(response.xpath("//div[contains(@class, 'description')]/p/text()").extract())
        crag = CragDjango(title=title, description=description)
        return crag
