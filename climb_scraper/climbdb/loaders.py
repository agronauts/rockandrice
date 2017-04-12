from scrapy.loader import ItemLoader
from scrapy.loader.processors import Join, MapCompose, TakeFirst

def parse_crag_name(raw_title):
    return raw_title.split(' |')[0]

class ClimbLoader(ItemLoader):

    name_in = MapCompose(lambda x: x.strip()) # Output processor
    name_out = TakeFirst()

    description_in = MapCompose(lambda x: x.strip()) # Output processor
    description_out = TakeFirst()

class CragLoader(ItemLoader):

    name_in = MapCompose(parse_crag_name) # Output processor
    name_out = TakeFirst()


