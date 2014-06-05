import csv, json

def csv_to_json(csvfile, delimiter):
    """Turn CSV file into list of dictionaries""" 
    input_file = open(csvfile, "r", newline="")
    data = csv.DictReader(input_file, delimiter=delimiter)

    i = 0
    cities_list = []
    csv_data = []

    for row in data:
        csv_data.append(row)

    for item in csv_data:
        i = i + 1
        if i < len(csv_data):
            # If country matches next country in csv_data list, combine into one dict entry
            if item['cca2'] == csv_data[i]['cca2']:
                entry = {"cca2": item["cca2"], "cities": [item["city"], csv_data[i]["city"]]}
                cities_list.append(entry)
    input_file.close()
    return(cities_list)

def combine_json(json_file, object2, key):
    """Combine json file with python object by merging entries with matching 'key'"""
    json_data = open(json_file, "r")
    data = json.load(json_data)
    json_data.close()
    for item_country in data:
        for item_cities in object2:
            if item_country[key] == item_cities[key]:
                item_country["largestCities"] = item_cities["cities"]

    # Write to data to json file
    with open('newCountries.json', 'w') as outfile:
        json.dump(data, outfile)

def main():
    cities_list = csv_to_json("largestcities2.txt", ":")
    combine_json("countries.json", cities_list, "cca2")

if __name__ == '__main__':
    main()

